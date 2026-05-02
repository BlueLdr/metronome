import { MINUTE } from "~/utils/constants";

import { Note } from "./note";

import type { ITempo, Measure } from "./measure";
import type { INote } from "./note";

//================================================

export interface TimeSignature {
  count: number;
  division: number;
}

export interface IRhythm {
  timeSignature: TimeSignature;
  notes: INote[];
}

export class Rhythm implements IRhythm {
  constructor(timeSignature: TimeSignature, notes: INote[]) {
    this.timeSignature = timeSignature;
    this.notePromises = [];
    this.notes = this.initializeNotes(notes);
  }

  readonly timeSignature: TimeSignature;
  readonly notes: Note[];

  private notePromises: Promise<void>[];

  private initializeNotes(defs: INote[]): Note[] {
    const notes: Note[] = [];
    let i = 0;
    for (const def of defs) {
      const resolveRef: { current: (...args: undefined[]) => void } = {
        current: () => undefined,
      };
      const promise = new Promise<void>((resolve) => {
        resolveRef.current = resolve;
      });
      this.notePromises.push(promise);
      notes.push(new Note(i, def, () => resolveRef.current()));
      i += 1;
    }

    return notes;
  }

  waitForInit() {
    return Promise.allSettled(this.notePromises);
  }

  nextNote(current: number | Note) {
    const index = typeof current === "number" ? current : current.index;
    if (index === this.notes.length - 1) {
      return this.notes[0];
    }
    return this.notes[index + 1];
  }

  getMeasureDuration(tempo: ITempo) {
    const { bpm, beatDivision } = tempo;
    const beatValueDuration = MINUTE / bpm;
    const beatDuration =
      beatValueDuration * (beatDivision / this.timeSignature.division);
    return beatDuration * this.timeSignature.count;
  }

  getMeasure(tempo: ITempo) {
    const duration = this.getMeasureDuration(tempo);
    let curTime = 0;
    const schedule: Measure = {
      rhythm: this,
      tempo,
      duration,
      notes: [],
    };

    for (const note of this.notes) {
      const noteDuration = note.interval * duration;
      schedule.notes.push({
        note,
        duration: noteDuration,
        relativeTimestamp: curTime,
      });

      curTime += noteDuration;
    }

    return schedule;
  }
}
