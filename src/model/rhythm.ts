import { Note, type INote } from "./note.ts";

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
    this.notes = this.initializeNotes(notes);
  }

  readonly timeSignature: TimeSignature;
  readonly notes: Note[];

  private initializeNotes(defs: INote[]): Note[] {
    const notes: Note[] = [];
    let i = 0;
    for (const def of defs) {
      notes.push(new Note(i, def));
      i += 1;
    }

    return notes;
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
