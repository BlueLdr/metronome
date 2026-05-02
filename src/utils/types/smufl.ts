import type { smuflGlyphnames } from "~/utils/constants";

//================================================

type OrdinalValue<T extends string> =
  T extends `${infer N extends number}${"nd" | "th" | "st" | "rd"}` ? N : never;

export type MusicGlyphName = keyof typeof smuflGlyphnames;
export type NoteBeamDivisionName = {
  [K in MusicGlyphName]: K extends `textCont${infer T}BeamLongStem` ? T : never;
}[MusicGlyphName];

export type NoteDivisionName = {
  [K in MusicGlyphName]: K extends `note${infer T}Up`
    ? T
    : K extends `noteWhole`
      ? "Whole"
      : never;
}[MusicGlyphName];

export type NoteBeamDivision = OrdinalValue<NoteBeamDivisionName>;
export type NoteDivision = {
  [K in NoteDivisionName]: K extends "Quarter"
    ? 4
    : K extends "Half"
      ? 2
      : K extends "Whole"
        ? 1
        : OrdinalValue<K>;
}[NoteDivisionName];
