import type {
  NoteBeamDivision,
  NoteDivision,
  NoteDivisionName,
} from "~/utils/types";

export const NOTE_DIVISIONS = [
  1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024,
] as const satisfies NoteDivision[];

export const NOTE_BEAM_DIVISIONS = [
  8, 16, 32,
] as const satisfies NoteBeamDivision[];

export const NoteDivisionNameMap = {
  1: "Whole",
  2: "Half",
  4: "Quarter",
  8: "8th",
  16: "16th",
  32: "32nd",
  64: "64th",
  128: "128th",
  256: "256th",
  512: "512th",
  1024: "1024th",
} as const satisfies Record<NoteDivision, NoteDivisionName>;
