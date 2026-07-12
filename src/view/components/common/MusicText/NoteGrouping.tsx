import { styled } from "@mui/material/styles";

import { NoteDivisionNameMap } from "~/utils/constants";
import { isNoteBeamDivision, isNoteDivision, isTuplet } from "~/utils/helpers";

import { MusicText } from "./MusicText";

import Box from "@mui/material/Box";

import type { MusicGlyphName, NoteDivision } from "~/utils/types";
import type { MusicTextProps } from "./MusicText";

//================================================

const NOTE_STAFF_SPACING_AMOUNT = (36 / 48 - (16 + 11 / 30) / 48) / 2 / 2;

const Bracket = styled("div")<{ ownerState: { side: "start" | "end" } }>`
  border: 1px solid ${({ theme }) => theme.palette.text.primary};
  border-bottom: none;
  border-${({ ownerState }) => (ownerState.side === "end" ? "left" : "right")}: none;
  height: ${({ theme }) => theme.spacing(1)};
  flex: 1 1 100%;
  margin-${({ ownerState }) => (ownerState.side === "end" ? "left" : "right")}: ${({ theme }) => theme.spacing(1.5)};
`;

const BracketContainer = styled("div")<{
  ownerState: {
    staffLine?: boolean;
    verticalOffset: number;
    useAltFont?: boolean;
    sideSpacing?: number;
  };
}>(({ theme, ownerState }) => ({
  position: "absolute",
  top: `calc(${ownerState.useAltFont ? 40 : 50}% - 0.5em)`,
  left: `calc(50% + ${(ownerState.useAltFont ? (ownerState.sideSpacing ?? 0) : 0.25) / 2}em)`,
  transform: `translate(-50%, calc(-50% - ${theme.spacing(ownerState.verticalOffset)} - 0.25em))`,
  width: ownerState.staffLine
    ? `calc(100% - ${ownerState.useAltFont ? (ownerState.sideSpacing ?? 0) : 0.125}em)`
    : "100%",
  whiteSpace: "pre",
  display: "flex",
  alignItems: "baseline",
}));

const StaffContainer = styled("div")`
  position: absolute;
  top: 0.5em;
  left: 50%;
  transform: translate(-50%, 0);
  width: max-content;
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
  staffLine?: boolean | "inline",
): [
  (MusicGlyphName | { value: React.ReactNode })[],
  MusicGlyphName[] | undefined,
  (MusicGlyphName | { value: React.ReactNode })[] | undefined,
] => {
  const children: (MusicGlyphName | { value: React.ReactNode })[] = [];
  let bracket: MusicGlyphName[] | undefined = undefined;
  const staff: (MusicGlyphName | { value: React.ReactNode })[] = [];
  if (!isNoteDivision(division)) {
    return [[], undefined, undefined];
  }
  if (staffLine === "inline") {
    children.push("staff1Line", { value: "  " });
  }
  const isTuplet_ = isTuplet(count, division);
  for (let i = 1; i <= count; i++) {
    if (staffLine && i <= count) {
      if (staffLine === "inline") {
        children.push("staff1LineWide");
      } else {
        staff.push("staff1LineWide");
      }
    }
    if (isNoteBeamDivision(division) && count > 1) {
      if (i === 1) {
        children.push(
          `textBlackNote${isTuplet_ && division !== 32 ? "Short" : "Long"}Stem`,
        );
      } else {
        children.push(
          division === 32
            ? "textBlackNoteFrac32ndLongStem"
            : `textBlackNoteFrac${NoteDivisionNameMap[division]}${isTuplet_ ? "Short" : "Long"}Stem`,
        );
      }
    } else {
      const divName = NoteDivisionNameMap[division];
      children.push(divName === "Whole" ? "noteWhole" : `note${divName}Up`);
      if (staffLine !== true && i < count) {
        if (!staffLine) {
          children.push({ value: " " });
        } else if (division > 32) {
          children.push({ value: " " });
        } else {
          children.push({ value: "  " }, "staff1LineNarrow", { value: " " });
        }
      }
    }

    if (isNoteBeamDivision(division) && i !== count) {
      children.push(
        division === 32
          ? "textCont32ndBeamLongStem"
          : `textCont${NoteDivisionNameMap[division]}Beam${isTuplet_ ? "Short" : "Long"}Stem`,
      );
    }
  }
  if (staffLine === true && count > 1 && division > 32) {
    staff.push("staff1LineNarrow");
  }
  if (staffLine === "inline" && division <= 32 && division > 1) {
    children.push({ value: " " });
  }
  if (isTuplet_) {
    bracket = numberToTupletText(count);
  }

  return [children, bracket, staff] as const;
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
  const isTuplet_ = isTuplet(count, division);

  const divName = NoteDivisionNameMap[division];
  children.push(divName === "Whole" ? "noteWhole" : `note${divName}Up`);
  children.push({
    value: (
      <Box key="count" fontFamily="var(--font-number-input)" component="span">
        {" "}
        &times; {count}
      </Box>
    ),
  });

  if (isTuplet_) {
    bracket = numberToTupletText(count);
  }

  return [children, bracket] as const;
};

export type NoteGroupingProps = Omit<MusicTextProps, "children"> & {
  division: NoteDivision;
  count: number;
  abbreviated?: boolean;
  staffLine?: boolean;
};

export function NoteGrouping({
  division,
  count,
  abbreviated,
  staffLine,
  useAltFont,
  ...props
}: NoteGroupingProps) {
  const [children, bracket, staff] = (
    abbreviated ? getAbbrGlyphsForGrouping : getGlyphsForGrouping
  )(division, count, staffLine ? (useAltFont ? true : "inline") : false);

  const verticalOffset =
    division < 32
      ? !useAltFont && division < 8 && division > 1
        ? 2
        : 0
      : division === 32
        ? 2
        : Math.log2(division) * (useAltFont ? 0.75 : 1);

  const letterSpacing =
    useAltFont &&
    !abbreviated &&
    !isNoteBeamDivision(division) &&
    children.length > 1
      ? division < 8
        ? 1 / 3
        : 1 / 10
      : undefined;

  const sideSpacing =
    staffLine && useAltFont && !isNoteBeamDivision(division) && count > 1
      ? NOTE_STAFF_SPACING_AMOUNT * 2
      : undefined;

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
          ownerState={{ staffLine, verticalOffset, useAltFont, sideSpacing }}
        >
          <Bracket ownerState={{ side: "start" }} />
          <MusicText
            useAltFont
            sx={{ fontSize: "0.666667em", lineHeight: "1em" }}
          >
            {bracket}
          </MusicText>
          <Bracket ownerState={{ side: "end" }} />
        </BracketContainer>
      )}
      <Box component="span" ml={sideSpacing ? `${sideSpacing}em` : undefined}>
        <MusicText
          useAltFont={useAltFont}
          sx={{
            letterSpacing: staffLine
              ? letterSpacing
                ? `${letterSpacing}em`
                : undefined
              : !abbreviated && division < 8
                ? "0.125em"
                : undefined,
            lineHeight: abbreviated ? "1.75em" : undefined,
            display: abbreviated ? "inline" : undefined,
          }}
        >
          {children}
        </MusicText>
      </Box>
      {staffLine && useAltFont && staff && (
        <StaffContainer>
          <MusicText
            useAltFont={useAltFont}
            sx={{
              letterSpacing: `calc(-${NOTE_STAFF_SPACING_AMOUNT}em + 0.1px)`,
            }}
          >
            {staff}
          </MusicText>
        </StaffContainer>
      )}
    </Box>
  );
}
