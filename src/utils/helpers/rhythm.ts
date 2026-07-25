import { Measure } from "~/model";

import { isInt } from "./math";

import type {
  ITempo,
  IMeasure,
  IBeat,
  ScheduledRhythm,
  TimeSignature,
  INote,
} from "~/model";
import type { MetronomePreset, SoundSettings } from "~/utils/types";

//================================================

export const isTuplet = (count: number, division: number) =>
  count > 2 && !isInt(division / count);

export const calculateBeats = (measure: IMeasure): (IBeat | undefined)[] => {
  let currentBeat: IBeat;
  let beatIndex = 0;
  const beats: (IBeat | undefined)[] = [];
  let duration = 0;

  measure.notes.forEach((note, index) => {
    if (isInt(duration)) {
      currentBeat = {
        noteIndex: index,
        beatIndex,
        totalInterval: note.interval,
        notes: [note],
      };
      beats.push(currentBeat);
      beatIndex++;
    } else {
      currentBeat.totalInterval += note.interval;
      currentBeat.notes.push(note);
      beats.push(undefined);
    }
    duration += note.interval * measure.timeSignature.division;
  });

  return beats;
};

export const getNoteStartTimeOffsetInScheduledRhythm = (
  rhythm: ScheduledRhythm,
  noteIndex: number,
  startingNoteIndex = 0,
) => {
  const relativeStartTime = rhythm.notes[noteIndex].relativeTimestamp;
  if (startingNoteIndex === 0) {
    return relativeStartTime;
  }
  const offset = rhythm.notes[startingNoteIndex]?.relativeTimestamp ?? 0;
  const startTimeOffsetRaw = relativeStartTime - offset;

  return startTimeOffsetRaw < 0
    ? startTimeOffsetRaw + rhythm.duration
    : startTimeOffsetRaw;
};

export const createMeasure = (
  timeSignature: TimeSignature,
  soundSettings: SoundSettings,
  subdivisions = 1,
) => {
  const newNoteCount = subdivisions * timeSignature.count;
  const newNotes: INote[] = [];
  for (let i = 0; i < newNoteCount; i++) {
    const noteInterval = 1 / timeSignature.division / subdivisions;
    const config =
      soundSettings[
        i === 0 ? "firstBeat" : i % subdivisions === 0 ? "base" : "subdivision"
      ];
    newNotes.push({
      interval: noteInterval,
      volume: config.volume,
      sound: config.sound ?? soundSettings.base.sound,
    });
  }

  return new Measure(timeSignature, newNotes);
};

export const buildPresetId = (
  timeSignature: TimeSignature,
  tempo: ITempo,
  subdivisionCount: number,
  name: string,
) =>
  `${timeSignature.count}-${timeSignature.division}_${subdivisionCount}_${tempo.bpm}-${tempo.beatDivision}_${name}`;

export const buildPreset = (
  measure: IMeasure,
  tempo: ITempo,
  name: string,
): MetronomePreset => {
  const subdivisionCount = measure.notes.length / measure.timeSignature.count;
  const id = buildPresetId(
    measure.timeSignature,
    tempo,
    subdivisionCount,
    name,
  );

  return {
    id,
    name,
    tempo,
    timeSignature: measure.timeSignature,
    subdivisionCount,
  };
};
