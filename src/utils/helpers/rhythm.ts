import { Rhythm } from "~/model";
import { DEFAULT_SOUND, DEFAULT_VOLUME_SETTINGS } from "~/utils/constants";

import { isInt } from "./math";

import type {
  IRhythm,
  IBeat,
  ScheduledMeasure,
  TimeSignature,
  INote,
} from "~/model";

//================================================

export const calculateBeats = (rhythm: IRhythm): (IBeat | undefined)[] => {
  let currentBeat: IBeat;
  let beatIndex = 0;
  const beats: (IBeat | undefined)[] = [];
  let duration = 0;

  rhythm.notes.forEach((note, index) => {
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
    duration += note.interval * rhythm.timeSignature.division;
  });

  return beats;
};

export const getNoteStartTimeOffsetInScheduledMeasure = (
  measure: ScheduledMeasure,
  noteIndex: number,
  startingNoteIndex = 0,
) => {
  const relativeStartTime = measure.notes[noteIndex].relativeTimestamp;
  if (startingNoteIndex === 0) {
    return relativeStartTime;
  }
  const offset = measure.notes[startingNoteIndex]?.relativeTimestamp ?? 0;
  const startTimeOffsetRaw = relativeStartTime - offset;

  return startTimeOffsetRaw < 0
    ? startTimeOffsetRaw + measure.duration
    : startTimeOffsetRaw;
};

export const createRhythm = (
  timeSignature: TimeSignature,
  subdivisions = 1,
  volumeSettings = DEFAULT_VOLUME_SETTINGS,
) => {
  const newNoteCount = subdivisions * timeSignature.count;
  const newNotes: INote[] = [];
  for (let i = 0; i < newNoteCount; i++) {
    const noteInterval = 1 / timeSignature.division / subdivisions;
    const volume =
      volumeSettings[
        i === 0
          ? "firstBeatVolume"
          : i % subdivisions === 0
            ? "beatVolume"
            : "subdivisionVolume"
      ];
    newNotes.push({
      interval: noteInterval,
      volume,
      sound: DEFAULT_SOUND,
    });
  }

  return new Rhythm(timeSignature, newNotes);
};
