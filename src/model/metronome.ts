import { getScreenFrameTime } from "~/utils/helpers";
import { TimerWorkerApi } from "~/workers/timer";

import { Note } from "./note";
import { Player } from "./player";
import { Rhythm } from "./rhythm";

import type { TimerWorkerTimeoutEvent } from "~/workers/timer";
import type { MeasureWithSources } from "./measure";
import type { INote } from "./note";

//================================================

export interface MetronomeOptions {
  bpm: number;
  beatDivision: number;
  setPlaying: (value: boolean) => void;
}

interface ScheduledMeasure extends MeasureWithSources {
  startTime: number;
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
      "measure-started": new Set(),
    };

    requestIdleCallback(() => {
      getScreenFrameTime().then((value) => {
        this.frameTime = value;
      });
    });
  }

  private player: Player;
  private bpm: number;
  private _beatDivision: number;

  private setPlaying: (value: boolean) => void;
  private frame: number | null = null;
  private frameTime: number = 1000 / 60;
  private nextNoteIndexAfterTempoChange: number | undefined = undefined;

  private _scheduledMeasure: ScheduledMeasure | undefined = undefined;
  private get scheduledMeasure() {
    return this._scheduledMeasure;
  }
  private set scheduledMeasure(value: ScheduledMeasure | undefined) {
    if (this._scheduledMeasure) {
      this._scheduledMeasure.notes.forEach((note) => {
        note.source.stop();
      });
      if (this.frame) {
        cancelAnimationFrame(this.frame);
      }
    }
    this._scheduledMeasure = value;
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

  private async scheduleMeasure(
    rhythm: Rhythm,
    startTime?: number,
    startingNoteIndex = 0,
  ) {
    if (this.scheduledMeasure) {
      if (!startTime) {
        console.warn(
          "[Player] Clearing scheduled measure to schedule a new measure",
        );
      }
      this.scheduledMeasure = undefined;
    }
    const measure = rhythm.getMeasure({
      bpm: this.bpm,
      beatDivision: this._beatDivision,
    });
    const scheduledMeasure = await rhythm
      .waitForInit()
      .then(() => this.player.getSourcesForMeasure(measure));

    const now = Date.now();
    const zeroTime = startTime ?? this.currentTime + 10;
    const offset =
      scheduledMeasure.notes[startingNoteIndex]?.relativeTimestamp ?? 0;
    scheduledMeasure.notes.forEach((note) => {
      const startTimeOffsetRaw = note.relativeTimestamp - offset;
      const startTimeOffset =
        startTimeOffsetRaw < 0
          ? startTimeOffsetRaw + scheduledMeasure.duration
          : startTimeOffsetRaw;
      note.source.start((zeroTime + startTimeOffset) / 1000);
      note.source.loop = true;
      note.source.loopStart = 0;
      note.source.loopEnd = scheduledMeasure.duration / 1000;
    });

    this.scheduledMeasure = {
      ...scheduledMeasure,
      startTime: zeroTime - offset,
    };
    this.dispatchEvent({
      type: "measure-started",
      measure: this.scheduledMeasure,
      startingNoteIndex,
      now,
    });
  }

  public start(rhythm: Rhythm) {
    if (!this.player.initialized) {
      this.player.init();
    }

    this.timer.init({
      now: Date.now(),
      timestamp: this.currentTime,
    });
    rhythm.waitForInit().then(() => {
      this.scheduleMeasure(rhythm);
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
    this.scheduledMeasure = undefined;
    this.playing = false;
  }

  public setBpm(bpm: number) {
    this.bpm = bpm;
    if (this.playing) {
      this.adjustTempo();
    }
  }
  public setBeatDivision(beatDivision: number) {
    this._beatDivision = beatDivision;
    if (this.playing) {
      this.adjustTempo();
    }
  }

  public adjustTempo() {
    if (!this.scheduledMeasure) {
      return;
    }
    const currentTime = this.currentTime;
    const now = Date.now();
    const curTimeInMeasure =
      (currentTime - this.scheduledMeasure.startTime) %
      this.scheduledMeasure.duration;
    const nextNote = this.scheduledMeasure.notes.find(
      (note) => note.relativeTimestamp > curTimeInMeasure,
    );
    const timeUntilNextNote =
      (nextNote ? nextNote.relativeTimestamp : this.scheduledMeasure.duration) -
      curTimeInMeasure;

    if (timeUntilNextNote < 10) {
      this.scheduleMeasure(
        this.scheduledMeasure.rhythm,
        this.currentTime,
        nextNote?.note.index,
      );
    } else {
      this.nextNoteIndexAfterTempoChange = nextNote?.note.index ?? 0;
      this.timer.start({
        timestamp: currentTime + timeUntilNextNote - this.frameTime,
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
      !this.scheduledMeasure ||
      this.nextNoteIndexAfterTempoChange == null
    ) {
      return;
    }

    this.scheduleMeasure(
      this.scheduledMeasure.rhythm,
      Math.max(e.timestamp, this.currentTime),
      this.nextNoteIndexAfterTempoChange,
    );
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
    if (this.scheduledMeasure) {
      this.scheduledMeasure.notes.forEach((note) => {
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
export type MetronomeMeasureStartedEvent = {
  type: "measure-started";
  measure: ScheduledMeasure;
  startingNoteIndex: number;
  now: number;
};

export type MetronomeEvent =
  | MetronomeNotePlayedEvent
  | MetronomeMeasureStartedEvent;

export type MetronomeEventType = MetronomeEvent["type"];

export type MetronomeEventListener<Type extends MetronomeEventType> = (
  event: MetronomeEvent & { type: Type },
) => void;
