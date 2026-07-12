import { NOTE_DIVISIONS } from "~/utils/constants";
import { NoteGrouping, WithOverflowAltContent } from "~/view/components/common";

import type { NoteGroupingProps } from "~/view/components/common";
import type { NoteDivision } from "~/utils/types";

//================================================

const isValidNoteDivision = (value: number): value is NoteDivision =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  NOTE_DIVISIONS.includes(value as any);

export type SubdivisionVisualizerProps = Omit<
  NoteGroupingProps,
  "division" | "count"
> & {
  timeSignatureDivision: NoteDivision;
  value: number;
};

export function SubdivisionVisualizer({
  value,
  timeSignatureDivision,
  ...props
}: SubdivisionVisualizerProps) {
  if (!isValidNoteDivision(timeSignatureDivision)) {
    return null;
  }
  const noteDiv =
    Math.pow(2, Math.floor(Math.log2(value))) * timeSignatureDivision;
  if (!isValidNoteDivision(noteDiv)) {
    return null;
  }

  return (
    <WithOverflowAltContent
      overflowContent={
        <NoteGrouping
          useAltFont
          {...props}
          count={value}
          division={noteDiv}
          abbreviated
        />
      }
    >
      <NoteGrouping useAltFont {...props} count={value} division={noteDiv} />
    </WithOverflowAltContent>
  );
}
