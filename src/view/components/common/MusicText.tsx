import { styled } from "@mui/material/styles";

import { smuflGlyphnames } from "~/utils/constants";

import Box from "@mui/material/Box";

import type { BoxProps } from "@mui/material/Box";
import type { MusicGlyphName, WithOverrides } from "~/utils/types";

//================================================

const TupletChar = styled("span")({
  textAlign: "center",
  verticalAlign: "top",
  width: "100%",
  lineHeight: 0.3,
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

export type MusicTextProps = WithOverrides<
  BoxProps,
  { children: Array<MusicGlyphName | { value: React.ReactNode }> }
>;

export function MusicText({ children, ...props }: MusicTextProps) {
  const content = children.map((i, index) => {
    if (typeof i === "object") {
      return i.value;
    }
    const char = smuflGlyphnames[i].codepoint.replace(/U\+(.*)/, (_, num) =>
      String.fromCodePoint(parseInt(num, 16)),
    );
    if (i.startsWith("tuplet")) {
      return <TupletChar key={`${i}-${index}`}>{char}</TupletChar>;
    } else if (i.startsWith("textTupletBracket")) {
      return <TupletBracket key={`${i}-${index}`}>{char}</TupletBracket>;
    }
    return char;
  });
  return (
    <Box
      component="span"
      {...props}
      sx={{
        position: "relative",
        fontSize: "1.5em",
        fontVariantLigatures: "common-ligatures discretionary-ligatures",
        fontFeatureSettings: `"liga" 1, "dlig" 1`,
        ...props.sx,
      }}
      fontFamily="Bravura Text"
    >
      {content}
    </Box>
  );
}
