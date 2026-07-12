import { NoteDivisionNameMap } from "~/utils/constants";

import { MusicText } from "./MusicText";

import Typography from "@mui/material/Typography";

import type { ITempo } from "~/model";
import type { NoteDivision } from "~/utils/types";
import type { MusicTextProps } from "./MusicText";

//================================================

export type TempoMarkerTextProps = Omit<
  MusicTextProps,
  "children" | "useAltFont"
> & {
  tempo: ITempo;
};

export function TempoMarkerText({ tempo, ...props }: TempoMarkerTextProps) {
  const beatDivisionName =
    NoteDivisionNameMap[tempo.beatDivision as NoteDivision];
  return (
    <MusicText {...props} lineHeight="1em">
      {[
        beatDivisionName === "Whole"
          ? "metNoteWhole"
          : `metNote${beatDivisionName}Up`,
        {
          value: (
            <Typography
              key="bpm"
              component="span"
              variant="body1"
              fontFamily="Times New Roman"
              fontWeight={600}
              fontSize="0.75em"
              lineHeight="inherit"
            >{` = ${tempo.bpm}`}</Typography>
          ),
        },
      ]}
    </MusicText>
  );
}
