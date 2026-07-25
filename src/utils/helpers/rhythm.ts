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
import type {
  MetronomePreset,
  NoteDivision,
  SoundSettings,
} from "~/utils/types";

//================================================

export const isTuplet = (count: number, division: number) =>
  count > 2 && !isInt(division / count);

export const getNoteInterval = (note: INote): number => {
  let interval = 1 / note.division;
  if (note.tuplet) {
    const fraction =
      Math.pow(2, Math.floor(Math.log2(note.tuplet))) / note.tuplet;
    interval *= fraction;
  }
  if (note.dotted) {
    interval *= note.dotted === 2 ? 1.75 : 1.5;
  }
  return interval;
};

export const calculateBeats = (measure: IMeasure): (IBeat | undefined)[] => {
  let currentBeat: IBeat;
  let beatIndex = 0;
  const beats: (IBeat | undefined)[] = [];
  let duration = 0;

  measure.notes.forEach((note, index) => {
    const interval = getNoteInterval(note);
    if (isInt(duration)) {
      currentBeat = {
        noteIndex: index,
        beatIndex,
        totalInterval: interval,
        notes: [note],
      };
      beats.push(currentBeat);
      beatIndex++;
    } else {
      currentBeat.totalInterval += interval;
      currentBeat.notes.push(note);
      beats.push(undefined);
    }
    duration += interval * measure.timeSignature.division;
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
  const isTuplet = !isInt(Math.log2(subdivisions));
  for (let i = 0; i < newNoteCount; i++) {
    const config =
      soundSettings[
        i === 0 ? "firstBeat" : i % subdivisions === 0 ? "base" : "subdivision"
      ];
    newNotes.push({
      division: (isTuplet
        ? timeSignature.division *
          Math.pow(2, Math.floor(Math.log2(subdivisions)))
        : timeSignature.division * subdivisions) as NoteDivision,
      volume: config.volume,
      sound: config.sound ?? soundSettings.base.sound,
      tuplet: isTuplet ? subdivisions : undefined,
    });
  }

  return new Measure(timeSignature, newNotes);
};

export const getIntervalWithSubdivision = (
  division: NoteDivision,
  subdivisions: number,
) => {
  return (1 /
    division /
    (!isInt(Math.log2(subdivisions))
      ? Math.pow(2, Math.floor(Math.log2(subdivisions)))
      : subdivisions)) as NoteDivision;
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
