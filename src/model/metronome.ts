import { getScreenFrameTime } from "~/utils/helpers";
import { TimerWorkerApi } from "~/workers/timer";

import { Note } from "./note";
import { Player } from "./player";
import { Measure } from "./measure";
import { Rhythm } from "./rhythm";

import type { TimerWorkerTimeoutEvent } from "~/workers/timer";
import type { IRhythmWithData, IRhythmWithSources } from "./rhythm";
import type { INote } from "./note";

//================================================

export interface MetronomeOptions {
  bpm: number;
  beatDivision: number;
  setPlaying: (value: boolean) => void;
}

export interface ScheduledRhythm extends IRhythmWithSources {
  startTime: number;
}

enum RhythmChangeType {
  measures,
  tempo,
}

//================================================

export class Metronome {
  constructor(options: MetronomeOptions) {
    const { bpm, beatDivision = 4, setPlaying } = options;
    this.bpm = bpm;
    this._beatDivision = beatDivision;
    this.setPlaying = setPlaying;
    this._playing = false;
    this.player = new Player();
    this.timer = new TimerWorkerApi();
    this.timer.on("timeout", (e) => this.onTimeout(e));
    this.listeners = {
      "note-played": new Set(),
      "rhythm-started": new Set(),
      stop: new Set(),
    };

    requestIdleCallback(() => {
      getScreenFrameTime().then((value) => {
        this.frameTime = value;
      });
    });
  }

  private player: Player;
  private measures: Measure[] | undefined = undefined;
  private bpm: number;
  private _beatDivision: number;

  private setPlaying: (value: boolean) => void;
  private frame: number | null = null;
  private frameTime: number = 1000 / 60;
  private nextNoteIndexAfterTempoChange: number | undefined = undefined;

  private _scheduledRhythm: ScheduledRhythm | undefined = undefined;
  private get scheduledRhythm() {
    return this._scheduledRhythm;
  }
  private set scheduledRhythm(value: ScheduledRhythm | undefined) {
    if (this._scheduledRhythm) {
      this._scheduledRhythm.notes.forEach((note) => {
        note.source.stop();
      });
      if (this.frame) {
        cancelAnimationFrame(this.frame);
      }
    }
    this._scheduledRhythm = value;
  }

  private _playing: boolean;
  public get playing() {
    return this._playing;
  }
  private set playing(value: boolean) {
    this._playing = value;
    this.setPlaying(value);
  }

  private listeners: {
    [Type in MetronomeEventType]: Set<MetronomeEventListener<Type>>;
  };

  private timer: TimerWorkerApi;
  // private ticker: TickWorkerApi;
  // private get tickInterval() {
  //   return Math.max(MINUTE / this.bpm / this.precision, MIN_TICK_INTERVAL);
  // }
  public get currentTime() {
    return (this.player.audioContext?.currentTime ?? 0) * 1000;
  }

  private get lookaheadTime() {
    return Math.max(this.frameTime * 2, 20);
  }

  private async scheduleRhythm(
    measures: Measure[],
    startTime?: number,
    startingNoteIndex = 0,
  ) {
    if (this.scheduledRhythm) {
      if (!startTime) {
        console.warn(
          "[Player] Clearing scheduled rhythm to schedule a new rhythm",
        );
      }
      this.scheduledRhythm = undefined;
    }
    const rhythm = new Rhythm({
      measures,
      tempo: {
        bpm: this.bpm,
        beatDivision: this._beatDivision,
      },
    });
    const scheduledRhythm = await Promise.allSettled(
      measures.map((m) => m.waitForInit()),
    ).then(() => this.player.getSourcesForRhythm(rhythm));

    const currentTime = this.currentTime;
    const now = Date.now();

    const zeroTime = startTime ?? currentTime + this.frameTime;
    const offset =
      scheduledRhythm.notes[startingNoteIndex]?.relativeTimestamp ?? 0;
    scheduledRhythm.notes.forEach((note) => {
      const startTimeOffsetRaw = note.relativeTimestamp - offset;
      const startTimeOffset =
        startTimeOffsetRaw < 0
          ? startTimeOffsetRaw + scheduledRhythm.duration
          : startTimeOffsetRaw;
      note.source.start((zeroTime + startTimeOffset) / 1000);
      note.source.loop = true;
      note.source.loopStart = 0;
      note.source.loopEnd = scheduledRhythm.duration / 1000;
    });

    this.scheduledRhythm = {
      ...scheduledRhythm,
      startTime: zeroTime - offset,
    };
    this.dispatchEvent({
      type: "rhythm-started",
      rhythm: this.scheduledRhythm,
      startingNoteIndex,
      now,
      timeUntilExpectedStart: Math.max(
        zeroTime - currentTime - this.frameTime,
        0,
      ),
    });
  }

  public start(measures: Measure[]) {
    if (!this.player.initialized) {
      this.player.init();
    }

    this.timer.init({
      now: Date.now(),
      timestamp: this.currentTime,
    });
    Promise.allSettled(measures.map((m) => m.waitForInit())).then(() => {
      this.measures = measures;
      this.scheduleRhythm(this.measures);
      this.player.start();
      this.playing = true;
    });
  }

  public stop() {
    cancelAnimationFrame(this.frame ?? -1);
    this.frame = null;
    this.player.stop();
    this.timer.stop();
    this.nextNoteIndexAfterTempoChange = undefined;
    this.scheduledRhythm = undefined;
    this.playing = false;
    this.dispatchEvent({ type: "stop" });
  }

  public setBpm(bpm: number) {
    this.bpm = bpm;
    if (this.playing) {
      this.updateRhythm(RhythmChangeType.tempo);
    }
  }
  public setBeatDivision(beatDivision: number) {
    this._beatDivision = beatDivision;
    if (this.playing) {
      this.updateRhythm(RhythmChangeType.tempo);
    }
  }

  public setMeasures(measures: Measure[]) {
    if (!this.scheduledRhythm || !this.playing) {
      return;
    }
    Promise.allSettled(measures.map((m) => m.waitForInit())).then(() => {
      this.measures = measures;
      this.updateRhythm(RhythmChangeType.measures);
    });
  }

  private updateRhythm(type: RhythmChangeType) {
    if (!this.scheduledRhythm || !this.measures) {
      return;
    }
    const currentTime = this.currentTime;
    const now = Date.now();

    const [nextNoteInOldRhythm, timeUntilNextNote] = this.getNextNote(
      this.scheduledRhythm,
      this.scheduledRhythm.startTime,
      currentTime,
    );
    let nextNote = nextNoteInOldRhythm;

    if (type === RhythmChangeType.measures) {
      const newRhythm = new Rhythm({
        tempo: { bpm: this.bpm, beatDivision: this._beatDivision },
        measures: this.measures,
      });
      const [nextNoteInNewRhythm] =
        nextNote.relativeTimestamp > newRhythm.duration
          ? [newRhythm.notes[0]]
          : this.getNextNote(
              newRhythm,
              this.scheduledRhythm.startTime,
              currentTime,
            );

      nextNote = nextNoteInNewRhythm;
    }

    if (timeUntilNextNote < this.lookaheadTime) {
      this.scheduleRhythm(
        this.measures,
        currentTime + timeUntilNextNote,
        nextNote?.note.index,
      );
    } else {
      this.nextNoteIndexAfterTempoChange = nextNote?.note.index ?? 0;
      this.timer.start({
        timestamp: currentTime + timeUntilNextNote - this.lookaheadTime,
        now,
        actionIfLate: "execute",
        id: this.getTimeoutId(),
      });
    }
  }

  private getTimeoutId() {
    return `${this.bpm}${this._beatDivision}${this.nextNoteIndexAfterTempoChange}`;
  }

  private onTimeout(e: TimerWorkerTimeoutEvent) {
    if (
      e.id !== this.getTimeoutId() ||
      !this.measures ||
      this.nextNoteIndexAfterTempoChange == null
    ) {
      return;
    }

    this.scheduleRhythm(
      this.measures,
      Math.max(e.timestamp, this.currentTime + this.frameTime * 2),
      this.nextNoteIndexAfterTempoChange,
    );
  }

  private getNextNote(
    rhythm: IRhythmWithData,
    startTime: number,
    currentTime: number,
  ) {
    const curTimeInRhythm = (currentTime - startTime) % rhythm.duration;
    const nextNote = Rhythm.nextNote(rhythm, curTimeInRhythm);
    let timeUntilNextNote =
      (nextNote ? nextNote.relativeTimestamp : rhythm.duration) -
      curTimeInRhythm;
    if (timeUntilNextNote < 0) {
      timeUntilNextNote += rhythm.duration;
    }

    if (timeUntilNextNote < this.lookaheadTime) {
      const followingNote = Rhythm.nextNote(
        rhythm,
        nextNote?.relativeTimestamp ?? -1,
      );
      return [
        followingNote,
        timeUntilNextNote + (nextNote ?? rhythm.notes[0]).duration,
      ] as const;
    }

    return [nextNote, timeUntilNextNote] as const;
  }

  public getNoteDuration(note: Note): number {
    return note.getDurationInMs(this.bpm, this._beatDivision);
  }

  //================================================

  getVolume() {
    return this.player.volume;
  }
  setVolume(value: number) {
    this.player.volume = value;
    if (this.scheduledRhythm) {
      this.scheduledRhythm.notes.forEach((note) => {
        note.note.onChangePlayerVolume(value);
      });
    }
  }

  private dispatchEvent<Type extends MetronomeEventType>(
    event: MetronomeEvent & { type: Type },
  ) {
    if (!(event.type in this.listeners)) {
      return;
    }
    this.listeners[event.type].forEach((callback) => {
      callback(event);
    });
  }

  on<Type extends MetronomeEventType>(
    type: Type,
    listener: MetronomeEventListener<Type>,
  ) {
    if (!(type in this.listeners)) {
      console.error(
        `[Metronome] Tried to add listener for invalid Metronome event type "${type}"`,
      );
      return;
    }
    this.listeners[type].add(listener);
  }

  off<Type extends MetronomeEventType>(
    type: Type,
    listener: MetronomeEventListener<Type>,
  ) {
    if (!(type in this.listeners)) {
      console.error(
        `[Metronome] Tried to remove listener for invalid Metronome event type "${type}"`,
      );
      return;
    }
    this.listeners[type].delete(listener);
  }
}

//================================================

export type MetronomeNotePlayedEvent = {
  type: "note-played";
  note: INote;
  index: number;
  duration: number;
};
export type MetronomeRhythmStartedEvent = {
  type: "rhythm-started";
  rhythm: ScheduledRhythm;
  startingNoteIndex: number;
  timeUntilExpectedStart: number;
  now: number;
};
export type MetronomeStopEvent = {
  type: "stop";
};

export type MetronomeEvent =
  | MetronomeNotePlayedEvent
  | MetronomeRhythmStartedEvent
  | MetronomeStopEvent;

export type MetronomeEventType = MetronomeEvent["type"];

export type MetronomeEventListener<Type extends MetronomeEventType> = (
  event: MetronomeEvent & { type: Type },
) => void;
