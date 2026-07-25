import { isTuplet } from "~/utils/helpers";

import { MusicText } from "./MusicText";
import { NoteGrouping } from "./NoteGrouping";
import { TempoMarkerText } from "./TempoMarkerText";
import { TimeSignatureText } from "./TimeSignatureText";

import Box from "@mui/material/Box";

import type { NoteDivision } from "~/utils/types";
import type { IMeasure, ITempo } from "~/model";
import type { MusicTextProps } from "./MusicText";

//================================================

const spaceNarrow = { value: "  " };
const space = { value: "    " };

export type RhythmStaffProps = {
  measure: IMeasure;
  tempo: ITempo;
} & Omit<MusicTextProps, "children" | "useAltFont">;

export function RhythmStaff({ measure, tempo, ...props }: RhythmStaffProps) {
  const noteDivision =
    Math.pow(
      2,
      Math.floor(Math.log2(measure.notes.length / measure.timeSignature.count)),
    ) * measure.timeSignature.division;
  const noteCount = measure.notes.length / measure.timeSignature.count;

  const verticalOffset =
    noteDivision <= 32
      ? 0
      : // : noteDivision === 32
        //   ? 0
        Math.log2(noteDivision) * 0.75;

  const hasTuplet = isTuplet(noteCount, noteDivision);

  return (
    <Box
      fontSize="3em"
      {...props}
      sx={{
        ...props.sx,
        position: "relative",
        top: (theme) =>
          `calc(${verticalOffset ? `${theme.spacing(verticalOffset / 2)} + ` : ""}${hasTuplet ? 0.25 : 0}em)`,
        lineHeight: `calc(1.75em + ${hasTuplet ? 0.75 : 0}em + ${verticalOffset}px)`,
        width: "max-content",
        marginBottom: (theme) =>
          `calc(-.25em + -1 * ${theme.spacing((0.75 * Math.log(32)) / 2 - verticalOffset / 2)} - ${hasTuplet ? verticalOffset / 2 : 0}px - ${hasTuplet ? 0 : 5 / 48}em)`,
      }}
    >
      <Box
        component="span"
        position="absolute"
        left="1em"
        fontSize=".5em"
        sx={{ display: "inline-flex" }}
        top="-0.375em"
      >
        <TempoMarkerText tempo={tempo} />
      </Box>
      <MusicText>{["staff1Line", space, "staff1Line"]}</MusicText>
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          transform: "translateY(-0.4em)",
        }}
      >
        <MusicText>{["unpitchedPercussionClef1"]}</MusicText>
      </Box>
      <MusicText>
        {[
          " ",
          "staff1LineNarrow",
          spaceNarrow,
          "staff1Line",
          // ...timeNum,
          // ...timeDen,
        ]}
      </MusicText>
      <TimeSignatureText
        timeSignature={measure.timeSignature}
        sx={{
          top: `calc(2.5em / -18)`,
        }}
      />
      <MusicText>{[space, "staff1Line", space]}</MusicText>
      <NoteGrouping
        sx={{
          flexShrink: 1,
          width: "auto",
          // transform: "translateY(-0.4em)",
        }}
        division={noteDivision as NoteDivision}
        count={noteCount}
        staffLine
      />
      <MusicText>{["staff1LineNarrow", spaceNarrow]}</MusicText>
    </Box>
  );
}
