import type { NoteBeamDivision, NoteDivision } from "~/utils/types";

export const NOTE_DIVISIONS = [
  1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024,
] as const satisfies NoteDivision[];

export const NOTE_BEAM_DIVISIONS = [
  8, 16, 32,
] as const satisfies NoteBeamDivision[];
