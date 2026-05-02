import { NOTE_BEAM_DIVISIONS, NOTE_DIVISIONS } from "~/utils/constants/smufl";

import type { NoteBeamDivision, NoteDivision } from "~/utils/types";

//================================================

export const isNoteDivision = (value: number): value is NoteDivision =>
  NOTE_DIVISIONS.includes(value as NoteDivision);

export const isNoteBeamDivision = (value: number): value is NoteBeamDivision =>
  NOTE_BEAM_DIVISIONS.includes(value as NoteBeamDivision);
