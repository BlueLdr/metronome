import { NoteDivisionNameMap, smuflGlyphnames } from "~/utils/constants";
import { NOTE_BEAM_DIVISIONS, NOTE_DIVISIONS } from "~/utils/constants/smufl";

import type { TimeSignature } from "~/model";
import type {
  Digit,
  MusicGlyphName,
  NoteBeamDivision,
  NoteDivision,
  NoteDivisionName,
} from "~/utils/types";

//================================================

export const isNoteDivision = (value: number): value is NoteDivision =>
  NOTE_DIVISIONS.includes(value as NoteDivision);

export const isNoteBeamDivision = (value: number): value is NoteBeamDivision =>
  NOTE_BEAM_DIVISIONS.includes(value as NoteBeamDivision);

const NOTE_BEAM_DIVISION_NAMES = NOTE_BEAM_DIVISIONS.map(
  (d) => NoteDivisionNameMap[d],
);
export const isNoteBeamDivisionName = (
  value: NoteDivisionName,
): value is (typeof NoteDivisionNameMap)[NoteBeamDivision] =>
  NOTE_BEAM_DIVISION_NAMES.includes(
    value as (typeof NoteDivisionNameMap)[NoteBeamDivision],
  );

export const getCharCodeFromName = (name: MusicGlyphName) =>
  smuflGlyphnames[name].codepoint.replace(/U\+(.*)/, (_, num) =>
    String.fromCodePoint(parseInt(num, 16)),
  );

export const getTimeSignatureChars = (
  timeSignature: TimeSignature,
  ligatures?: boolean,
) => {
  const maybeSpace = (char: string, index: number, arr: string[]) =>
    (char === "1" || char === "0" || arr.length > 1) && index < arr.length - 1
      ? [{ value: "   " }]
      : [];
  const numeratorItems = `${Math.round(timeSignature.count)}`
    .split("")
    .reduce<
      (MusicGlyphName | { value: string })[]
    >((items, char, i, arr) => [...items, ...(ligatures ? ["timeSigCombNumerator" as const] : []), `timeSig${char as `${Digit}`}`, ...maybeSpace(char, i, arr)], []);
  const denominatorItems = `${Math.round(timeSignature.division)}`
    .split("")
    .reduce<
      (MusicGlyphName | { value: string })[]
    >((items, char, i, arr) => [...items, ...(ligatures ? ["timeSigCombDenominator" as const] : []), `timeSig${char as `${Digit}`}`, ...maybeSpace(char, i, arr)], []);

  return [numeratorItems, denominatorItems] as const;
};

export type NoteCharOptions = {
  beam?: boolean;
  tuplet?: true | "start" | "end" | number;
  direction?: "Up" | "Down";
};

/*
export const getNoteChars = (noteDivision: NoteDivision | NoteDivisionName, options?: NoteCharOptions) => {
  const {
    beam,
    tuplet,,
    direction = "Up"
  } = options ?? {};

  const name = typeof noteDivision === "number" ? NoteDivisionNameMap[noteDivision] : noteDivision;
  if (beam && isNoteBeamDivisionName(name)) {

  }
  const noteChar = (name === "Whole" ? "noteWhole" : `note${name}${direction}`) satisfies MusicGlyphName
}
*/
