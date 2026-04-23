import { MINUTE } from "~/utils/constants";
import { TickWorkerApi } from "~/workers/tick";

import { Note } from "./note";
import { Player } from "./player";
import { Rhythm } from "./rhythm";

//================================================

const DEFAULT_PRECISION = 4;
// const DEFAULT_TOLERANCE = 10;
const MIN_TICK_INTERVAL = 10; // ms

//================================================

interface MetronomeTimingState {
  lastTickTimestamp: number;
  lastNoteTimestamp: number;
  lastNoteDuration: number;
  // elapsedTicksSinceLastBeat: number;
  // drift: RollingAverage;
}

interface MetronomeRhythmState {
  rhythm: Rhythm;
  nextNoteIndex: number;
  nextNote: Note;
}

export interface MetronomeOptions {
  precision?: number;
  tolerance?: number;
  scheduleAheadTickCount?: number;
  bpm: number;
  beatDivision: number;
  setPlaying: (value: boolean) => void;
}

interface ScheduledNote {
  timestamp: number;
  source: AudioBufferSourceNode;
}

//================================================

export class Metronome {
  constructor(options: MetronomeOptions) {
    const {
      precision = DEFAULT_PRECISION,
      // tolerance = DEFAULT_TOLERANCE,
      scheduleAheadTickCount = 2 * precision,
      bpm,
      beatDivision = 4,
      setPlaying,
    } = options;
    this.precision = precision;
    // this.tolerance = tolerance;
    this.scheduleAheadTickCount = scheduleAheadTickCount;
    this.bpm = bpm;
    this._beatDivision = beatDivision;
    this.setPlaying = setPlaying;
    this.player = new Player();
    this.ticker = new TickWorkerApi();
    this.ticker.on("tick", () => this.tick());
    this.scheduledNoteQueue = new Map();
  }

  private player: Player;
  private bpm: number;
  private _beatDivision: number;

  private precision: number;
  // private tolerance: number;
  private scheduleAheadTickCount: number;

  private timingState: MetronomeTimingState | undefined = undefined;
  private rhythmState: MetronomeRhythmState | undefined = undefined;
  private setPlaying: (value: boolean) => void;
  private scheduledNoteQueue: Map<Note, ScheduledNote>;

  private ticker: TickWorkerApi;
  private get tickInterval() {
    return Math.max(MINUTE / this.bpm / this.precision, MIN_TICK_INTERVAL);
  }
  public get currentTime() {
    return this.player.audioContext.currentTime * 1000;
  }

  private tick() {
    const curState = this.timingState;
    if (!curState) {
      throw new Error(`Called "tick" without starting the metronome`);
    }
    const currentTime = this.currentTime;
    const { lastNoteTimestamp, lastNoteDuration } = curState;

    const lookAheadInterval = this.tickInterval * this.scheduleAheadTickCount;
    const rhythm = this.rhythmState.rhythm;

    let lookAheadTimestamp = lastNoteTimestamp + lastNoteDuration;
    for (let i = 0; i < rhythm.notes.length; i++) {
      const index = (this.rhythmState.nextNoteIndex + i) % rhythm.notes.length;
      const note = rhythm.notes[index];
      if (!note) {
        continue;
      }
      if (lookAheadTimestamp <= currentTime + lookAheadInterval) {
        if (!this.scheduledNoteQueue.has(note)) {
          const noteTimestamp = lookAheadTimestamp;
          this.player.scheduleNote(note, noteTimestamp).then((source) => {
            this.scheduledNoteQueue.set(note, {
              timestamp: noteTimestamp,
              source,
            });
          });
        }
        lookAheadTimestamp += this.getNoteDuration(note);
      } else {
        break;
      }
    }

    // remove notes that have been played from the queue
    Array.from(this.scheduledNoteQueue.entries()).forEach(
      ([note, { timestamp }]) => {
        if (this.currentTime >= timestamp) {
          this.timingState = {
            lastTickTimestamp: currentTime,
            lastNoteTimestamp: timestamp,
            lastNoteDuration: this.getNoteDuration(note),
          };
          const nextNote = this.rhythmState.rhythm.nextNote(note);
          this.rhythmState = {
            nextNote,
            nextNoteIndex: nextNote.index,
            rhythm: this.rhythmState.rhythm,
          };
          this.scheduledNoteQueue.delete(note);
        }
      },
    );
  }

  public start(rhythm: Rhythm) {
    if (!this.player.initialized) {
      this.player.init();
    }

    rhythm.waitForInit().then(() => {
      this.scheduledNoteQueue.clear();
      const currentTime = this.currentTime;

      this.setPlaying(true);
      this.player.scheduleNote(rhythm.notes[0], currentTime);
      this.rhythmState = {
        rhythm,
        nextNoteIndex: 1,
        nextNote: rhythm.notes[1],
      };
      this.timingState = {
        lastTickTimestamp: currentTime,
        lastNoteDuration: this.getNoteDuration(rhythm.notes[0]),
        lastNoteTimestamp: currentTime,
        // elapsedTicksSinceLastBeat: 0,
      };
      this.player.start();
      this.ticker.start({ interval: this.tickInterval });
    });
  }

  /*  private async tick() {
    const curState = this.timingState;
    if (!curState) {
      throw new Error(`Called "tick" without starting the metronome`);
    }

    const { lastTickTimestamp, nextBeatTimestamp } = curState;
    const now = Date.now();

    let timeUntilNextBeat = nextBeatTimestamp - now;
    if (timeUntilNextBeat <= this.tolerance) {
      this.timingState = await this.executeBeat();
      timeUntilNextBeat = this.timingState.lastBeatInterval;
      if (lastTickTimestamp > 0) {
        console.log(
          "Average drift is: ",
          curState.drift.next(now - nextBeatTimestamp),
        );
      }
    } else {
      curState.elapsedTicksSinceLastBeat += 1;
      curState.lastTickTimestamp = now;
    }
    let drift = 0;
    // if (curState.drift.count > DRIFT_SAMPLE_SIZE / 3) {
    //   drift = curState.drift.value;
    // }

    const tickInterval =
      (1 / this.precision) * this.timingState.lastBeatInterval;
    this.timeout = setTimeout(
      () => this.tick(),
      Math.min(tickInterval, timeUntilNextBeat) - drift,
    );

    // difference between current moment and the moment this tick was *expected* to happen
    // add last drift value to current moment to get the time it would've been if we hadn't compensated for drift
    // if (lastTickTimestamp > 0) {
    //   curState.drift.next(now + drift - (lastTickTimestamp + tickInterval));
    // }
  }

  private async executeBeat(): Promise<MetronomeTimingState> {
    if (!this.rhythmState) {
      throw new Error(`Called "executeBeat" without starting the metronome`);
    }
    const beat = this.rhythmState?.nextBeat;
    const timestamp = await this.player.playBeat(beat);

    const lastBeatInterval = this.getBeatInterval(beat);
    const nextBeat = this.rhythmState.rhythm.nextBeat(beat);

    // get next beat
    //   calculate time until next beat
    //   store
    //      last beat timestamp
    //      next beat timestamp
    //      next beat interval

    this.rhythmState = {
      rhythm: this.rhythmState.rhythm,
      nextBeat,
      nextBeatIndex: nextBeat.index,
    };
    return {
      lastBeatTimestamp: timestamp,
      nextBeatTimestamp: timestamp + lastBeatInterval,
      lastBeatInterval: lastBeatInterval,
      elapsedTicksSinceLastBeat: 0,
      lastTickTimestamp: timestamp,
      drift: this.timingState.drift,
    };
  }

  public start(rhythm: Rhythm) {
    this.timingState = {
      lastTickTimestamp: 0,
      lastBeatTimestamp: 0,
      nextBeatTimestamp: 0,
      lastBeatInterval: 0,
      elapsedTicksSinceLastBeat: 0,
      drift: new RollingAverage(DRIFT_SAMPLE_SIZE, 0),
    };
    this.rhythmState = {
      rhythm,
      nextBeat: rhythm.beats[0],
      nextBeatIndex: 0,
    };
    this.setPlaying(true);
    this.tick();
  }

  */

  private clearQueue(clearAll = false) {
    Array.from(this.scheduledNoteQueue.entries()).forEach(
      ([note, { source, timestamp }]) => {
        if (
          clearAll ||
          (this.timingState &&
            timestamp > this.timingState.lastTickTimestamp + this.tickInterval)
        )
          source.stop();
        this.scheduledNoteQueue.delete(note);
      },
    );
  }

  public stop() {
    this.player.stop();
    this.ticker.stop();
    this.timingState = undefined;
    this.rhythmState = undefined;
    this.clearQueue(true);
    this.setPlaying(false);
  }

  public setBpm(bpm: number) {
    this.bpm = bpm;
    this.clearQueue();
    this.ticker.change({ interval: this.tickInterval });
  }

  public getNoteDuration(note: Note): number {
    return note.getDurationInMs(this.bpm, this._beatDivision);
  }

  //================================================

  get on() {
    return this.ticker.on;
  }
  get off() {
    return this.ticker.off;
  }
}
