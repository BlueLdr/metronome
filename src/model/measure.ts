import { MINUTE } from "~/utils/constants";

import { Note } from "./note";

import type { NoteDivision } from "~/utils/types";
import type { ITempo } from "./rhythm";
import type { INote } from "./note";

//================================================

export interface TimeSignature {
  count: number;
  division: NoteDivision;
}

export interface IMeasure {
  timeSignature: TimeSignature;
  notes: INote[];
}

export class Measure implements IMeasure {
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

  getMeasureDuration(tempo: ITempo) {
    const { bpm, beatDivision } = tempo;
    const beatValueDuration = MINUTE / bpm;
    const beatDuration =
      beatValueDuration * (beatDivision / this.timeSignature.division);
    return beatDuration * this.timeSignature.count;
  }

  toJSON() {
    return {
      timeSignature: this.timeSignature,
      notes: this.notes,
    };
  }
}
