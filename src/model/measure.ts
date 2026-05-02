import type { Note } from "./note";
import type { Rhythm } from "./rhythm";

//================================================

export interface ITempo {
  bpm: number;
  beatDivision: number;
}

export interface MeasureNote {
  note: Note;
  relativeTimestamp: number;
  duration: number;
}

export interface Measure {
  rhythm: Rhythm;
  tempo: ITempo;
  duration: number;
  notes: MeasureNote[];
}

export interface MeasureNoteWithSource extends MeasureNote {
  source: AudioBufferSourceNode;
}

export interface MeasureWithSources extends Omit<Measure, "notes"> {
  notes: MeasureNoteWithSource[];
}
