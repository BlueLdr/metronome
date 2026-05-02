import { styled } from "@mui/material/styles";

import { isInt, isNoteBeamDivision, isNoteDivision } from "~/utils/helpers";

import { MusicText } from "./MusicText";

import Box from "@mui/material/Box";

import type {
  MusicGlyphName,
  NoteDivision,
  NoteDivisionName,
} from "~/utils/types";
import type { MusicTextProps } from "./MusicText";

//================================================

const Bracket = styled("div")<{ ownerState: { side: "start" | "end" } }>`
  border: 1px solid ${({ theme }) => theme.palette.text.primary};
  border-bottom: none;
  border-${({ ownerState }) => (ownerState.side === "end" ? "left" : "right")}: none;
  height: ${({ theme }) => theme.spacing(1)};
  flex: 1 1 100%;
  margin-${({ ownerState }) => (ownerState.side === "end" ? "left" : "right")}: ${({ theme }) => theme.spacing(1.5)};
`;

const BracketContainer = styled("div")`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  white-space: nowrap;
  display: flex;
`;

//================================================

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const numberToTupletText = (value: number) => {
  return `${Math.round(value)}`.split("").reduce((chars, char) => {
    const digit = Number(char);
    if (isNaN(digit)) {
      return chars;
    }
    chars.push(`tuplet${digit as Digit}`);
    return chars;
  }, [] as MusicGlyphName[]);
};

const getGlyphsForGrouping = (
  division: number,
  count: number,
): [
  (MusicGlyphName | { value: React.ReactNode })[],
  MusicGlyphName[] | undefined,
] => {
  const children: (MusicGlyphName | { value: React.ReactNode })[] = [];
  let bracket: MusicGlyphName[] | undefined = undefined;
  if (!isNoteDivision(division)) {
    return [[], undefined];
  }
  const isTuplet = count > 2 && !isInt(division / count);
  for (let i = 1; i <= count; i++) {
    if (isNoteBeamDivision(division) && count > 1) {
      if (i === 1) {
        children.push(
          `textBlackNote${isTuplet && division !== 32 ? "Short" : "Long"}Stem`,
        );
      } else {
        children.push(
          division === 32
            ? "textBlackNoteFrac32ndLongStem"
            : `textBlackNoteFrac${noteDivisionNameMap[division]}${isTuplet ? "Short" : "Long"}Stem`,
        );
      }
    } else {
      const divName = noteDivisionNameMap[division];
      children.push(divName === "Whole" ? "noteWhole" : `note${divName}Up`);
      if (i < count) {
        children.push({ value: " " });
      }
    }

    if (isNoteBeamDivision(division) && i !== count) {
      children.push(
        division === 32
          ? "textCont32ndBeamLongStem"
          : `textCont${noteDivisionNameMap[division]}Beam${isTuplet ? "Short" : "Long"}Stem`,
      );
    }
  }
  if (isTuplet) {
    bracket = numberToTupletText(count);
  }

  return [children, bracket];
};

const getAbbrGlyphsForGrouping = (
  division: number,
  count: number,
): [
  (MusicGlyphName | { value: React.ReactNode })[],
  MusicGlyphName[] | undefined,
] => {
  const children: (MusicGlyphName | { value: React.ReactNode })[] = [];
  let bracket: MusicGlyphName[] | undefined = undefined;
  if (!isNoteDivision(division)) {
    return [[], undefined];
  }
  const isTuplet = count > 2 && !isInt(division / count);

  const divName = noteDivisionNameMap[division];
  children.push(divName === "Whole" ? "noteWhole" : `note${divName}Up`);
  children.push({
    value: (
      <Box key="count" fontFamily="var(--font-number-input)" component="span">
        {" "}
        &times; {count}
      </Box>
    ),
  });

  if (isTuplet) {
    bracket = numberToTupletText(count);
  }

  return [children, bracket] as const;
};

const noteDivisionNameMap = {
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

export type NoteGroupingProps = Omit<MusicTextProps, "children"> & {
  division: NoteDivision;
  count: number;
  abbreviated?: boolean;
};

export function NoteGrouping({
  division,
  count,
  abbreviated,
  ...props
}: NoteGroupingProps) {
  const [children, bracket] = (
    abbreviated ? getAbbrGlyphsForGrouping : getGlyphsForGrouping
  )(division, count);

  const verticalOffset =
    division < 32 ? 0 : division === 32 ? 2 : Math.log2(division) * 0.75;

  return (
    <Box
      component="span"
      {...props}
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: "100%",
        ...props.sx,
      }}
    >
      {bracket && (
        <BracketContainer
          sx={{
            top: (theme) => theme.spacing(-verticalOffset),
          }}
        >
          <Bracket ownerState={{ side: "start" }} />
          <MusicText sx={{ lineHeight: 0.3 }}>{bracket}</MusicText>
          <Bracket ownerState={{ side: "end" }} />
        </BracketContainer>
      )}
      <MusicText
        sx={{
          pt: bracket ? `${verticalOffset * 2}px` : undefined,
          mt: bracket ? `${-verticalOffset}px` : undefined,
          lineHeight: 2,
          whiteSpace: "nowrap",
          letterSpacing: !abbreviated && division < 8 ? ".125em" : undefined,
        }}
      >
        {children}
      </MusicText>
    </Box>
  );
}
