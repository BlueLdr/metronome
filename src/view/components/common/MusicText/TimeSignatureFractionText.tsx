import { styled } from "@mui/material/styles";

import { MusicText } from "./MusicText";

import Box from "@mui/material/Box";

import type { TimeSignature } from "~/model";
import type { MusicTextProps } from "./MusicText";

//================================================

const NumberText = styled("span")<{ ownerState: "numerator" | "denominator" }>`
  font-family: "Bravura Numbers";
  font-size: 1.125em;
  line-height: 1em;
  display: inline-flex;
  height: 1em;
  ${({ ownerState }) =>
    ownerState === "numerator"
      ? {
          verticalAlign: "super",
          marginInlineEnd: "-0.375em",
        }
      : { verticalAlign: "sub", marginInlineStart: "-0.375em" }}
`;

const Container = styled("span")`
  height: 1em;
`;

export type TimeSignatureFractionTextProps = Omit<
  MusicTextProps,
  "children"
> & {
  timeSignature: TimeSignature;
};

export function TimeSignatureFractionText({
  timeSignature,
  ...props
}: TimeSignatureFractionTextProps) {
  return (
    <Box
      component="span"
      {...props}
      sx={{
        position: "relative",
        lineHeight: "inherit",
        fontSize: "inherit",
        display: "inline-flex",
        ...props.sx,
      }}
    >
      <Container>
        <NumberText ownerState="numerator">{timeSignature.count}</NumberText>
      </Container>
      <Container>
        <MusicText
          useAltFont
          sx={{
            lineHeight: 0,
            whiteSpace: "inherit",
            letterSpacing: "inherit",
            fontSize: "3em",
            display: "inline-flex",
            height: `${1 / 3}em`,
            verticalAlign: `.125em`,
          }}
        >
          {["timeSigFractionalSlash"]}
        </MusicText>
      </Container>
      <Container>
        <NumberText ownerState="denominator">
          {timeSignature.division}
        </NumberText>
      </Container>
    </Box>
  );
}
