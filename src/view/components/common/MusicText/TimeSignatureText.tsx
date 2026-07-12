import { getTimeSignatureChars } from "~/utils/helpers";

import { MusicText } from "./MusicText";

import Box from "@mui/material/Box";

import type { TimeSignature } from "~/model";
import type { MusicTextProps } from "./MusicText";

//================================================

export type TimeSignatureTextProps = Omit<MusicTextProps, "children"> & {
  timeSignature: TimeSignature;
  inlineSx?: MusicTextProps["sx"];
};

export function TimeSignatureText({
  timeSignature,
  useAltFont,
  sx,
  inlineSx,
  ...props
}: TimeSignatureTextProps) {
  const [numeratorItems, denominatorItems] = getTimeSignatureChars(
    timeSignature,
    true,
  );

  if (
    numeratorItems.length <= 2 &&
    denominatorItems.length <= 2 &&
    timeSignature.division !== 1 &&
    timeSignature.count !== 1
  ) {
    return (
      <MusicText
        {...{
          ...props,
          useAltFont,
          sx: inlineSx,
        }}
      >
        {[...numeratorItems, ...denominatorItems]}
      </MusicText>
    );
  }

  return (
    <Box component="span" {...props} sx={{ position: "relative", ...sx }}>
      <MusicText
        {...{
          useAltFont,
        }}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {[...numeratorItems]}
      </MusicText>
      <MusicText
        {...{
          useAltFont,
        }}
        sx={{
          position: "absolute",
          bottom: "50%",
          left: "50%",
          transform: "translate(-50%, 50%)",
        }}
      >
        {[...denominatorItems]}
      </MusicText>
    </Box>
  );
}
