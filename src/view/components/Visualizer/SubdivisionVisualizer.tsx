import { NOTE_DIVISIONS } from "~/utils/constants";
import { NoteGrouping, WithOverflowAltContent } from "~/view/components/common";

import type { NoteDivision } from "~/utils/types";

//================================================

const isValidNoteDivision = (
  value: number,
): value is 1 | 2 | 4 | 8 | 16 | 32 | 64 =>
  [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024].includes(value);

const noteSets = NOTE_DIVISIONS.reduce(
  (output, base) => {
    if (!output[base]) {
      output[base] = [null];
    }
    for (let sub = 1; sub <= 8; sub++) {
      const noteDiv = Math.pow(2, Math.floor(Math.log2(sub))) * base;
      if (!isValidNoteDivision(noteDiv)) {
        break;
      }
      output[base][sub] = (
        <WithOverflowAltContent
          overflowContent={
            <NoteGrouping
              alignSelf="flex-start"
              sx={{ fontSize: (theme) => theme.typography.h4.fontSize }}
              count={sub}
              division={noteDiv}
              abbreviated
            />
          }
        >
          <NoteGrouping
            alignSelf="flex-start"
            sx={{ fontSize: (theme) => theme.typography.h4.fontSize }}
            count={sub}
            division={noteDiv}
          />
        </WithOverflowAltContent>
      );
    }
    return output;
  },
  {} as Record<NoteDivision, React.ReactNode[]>,
);

export type SubdivisionVisualizerProps = {
  timeSignatureDivision: NoteDivision;
  value: number;
};

export function SubdivisionVisualizer({
  value,
  timeSignatureDivision,
}: SubdivisionVisualizerProps) {
  return isValidNoteDivision(timeSignatureDivision)
    ? noteSets[timeSignatureDivision][value]
    : null;
}
