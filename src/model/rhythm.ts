import { Note } from "./note";

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
      const resolveRef = { current: () => undefined };
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

  getShortestBeatDuration() {
    return Math.min(...this.notes.map((b) => b.interval));
  }
}
