import { styled } from "@mui/material/styles";

import { getCharCodeFromName } from "~/utils/helpers";

import Box from "@mui/material/Box";

import type { BoxProps } from "@mui/material/Box";
import type { MusicGlyphName, WithOverrides } from "~/utils/types";

//================================================

const TupletChar = styled("span")({
  textAlign: "center",
  verticalAlign: "top",
  width: "100%",
  // lineHeight: 0.3,
  display: "inline-block",
});
const TupletBracket = styled("span")({
  position: "absolute",
  top: "50%",
  verticalAlign: "text-bottom",
  "&:first-child": {
    left: 0,
  },
  "&:last-child": {
    right: 0,
  },
});

const Root = styled(Box, { name: "MuiMusicText", slot: "root" })<{
  ownerState: Pick<MusicTextProps, "useAltFont">;
}>(({ ownerState }) => ({
  position: "relative",
  fontFamily: `${!ownerState.useAltFont ? "Bravura Text, " : ""}Bravura, Times New Roman`,
  fontVariantLigatures: "common-ligatures discretionary-ligatures contextual",
  fontFeatureSettings: `"liga" 1, "clig" 1, "dlig" 1`,
  lineHeight: "2.5em",
  whiteSpace: "pre",
  letterSpacing: "-0.1px",
  display: "inline-flex",
}));

export type MusicTextProps = WithOverrides<
  BoxProps,
  {
    children: Array<MusicGlyphName | " " | { value: React.ReactNode }>;
    useAltFont?: boolean;
  }
>;

export function MusicText({ children, useAltFont, ...props }: MusicTextProps) {
  const items = children.map((i, index) => {
    if (typeof i === "object") {
      return i.value;
    }
    if (i === " ") {
      return i;
    }
    const char = getCharCodeFromName(i);
    if (i.startsWith("tuplet")) {
      return <TupletChar key={`${i}-${index}`}>{char}</TupletChar>;
    } else if (i.startsWith("textTupletBracket")) {
      return <TupletBracket key={`${i}-${index}`}>{char}</TupletBracket>;
    }
    return char;
  });

  const content = items.every((c) => typeof c !== "object")
    ? items.join("")
    : items;

  return (
    <Root
      ownerState={{
        useAltFont,
      }}
      component="span"
      {...props}
    >
      {content}
    </Root>
  );
}
