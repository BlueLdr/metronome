import { MINUTE } from "~/utils/constants";

import { Measure } from "./measure";

import type { IMeasure } from "./measure";
import type { Note } from "./note";

//================================================

export interface ITempo {
  bpm: number;
  beatDivision: number;
}

export interface RhythmNote {
  note: Note;
  relativeTimestamp: number;
  duration: number;
}

export interface IRhythm {
  measures: IMeasure[];
  tempo: ITempo;
}

export interface IRhythmWithData extends IRhythm {
  duration: number;
  notes: RhythmNote[];
}

export interface RhythmNoteWithSource extends RhythmNote {
  source: AudioBufferSourceNode;
}

export interface IRhythmWithSources extends Omit<IRhythmWithData, "notes"> {
  notes: RhythmNoteWithSource[];
}

export class Rhythm implements IRhythmWithData {
  constructor(config: IRhythm) {
    this.measures = config.measures.map(
      (measure) => new Measure(measure.timeSignature, measure.notes),
    );
    this.tempo = config.tempo;
    this.duration = this.measures.reduce(
      (total, measure) => total + measure.getMeasureDuration(this.tempo),
      0,
    );
    this.notes = this.measures.reduce(
      (notes, measure) => [
        ...notes,
        ...Rhythm.getRhythmNotesFromMeasure(measure, this.tempo),
      ],
      [] as RhythmNote[],
    );
  }
  measures: Measure[];
  tempo: ITempo;
  duration: number;
  notes: RhythmNote[];

  static nextNote(
    rhythm: Pick<Rhythm, 'notes'>,
    currentNoteOrRelativeTimestamp: RhythmNote | number,
  ) {
    const current =
      typeof currentNoteOrRelativeTimestamp === "number"
        ? currentNoteOrRelativeTimestamp
        : currentNoteOrRelativeTimestamp.relativeTimestamp;
    return (
      rhythm.notes.find((n) => n.relativeTimestamp > current) ?? rhythm.notes[0]
    );
  }

  static getRhythmNotesFromMeasure(measure: Measure, tempo: ITempo) {
    const wholeNoteDuration = (MINUTE / tempo.bpm) * tempo.beatDivision;

    let curTime = 0;
    const notes: RhythmNote[] = [];

    for (const note of measure.notes) {
      const noteDuration = note.interval * wholeNoteDuration;
      notes.push({
        note,
        duration: noteDuration,
        relativeTimestamp: curTime,
      });

      curTime += noteDuration;
    }

    return notes;
  }

  toJSON() {
    return {
      measures: this.measures.map((m) => m.toJSON()),
      tempo: this.tempo,
    };
  }
}
