import type { IRhythm, IBeat, ScheduledMeasure } from "~/model";

//================================================

// account for stupid js rounding
const isInt = (num: number) => Math.round(num * 1e6) / 1e6 === Math.round(num);

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
