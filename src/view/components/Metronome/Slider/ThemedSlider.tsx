import { useTheme } from "@mui/material/styles";
import { RoundSlider } from "blueldr-react-round-slider";

import type { ISettings } from "blueldr-react-round-slider";

//================================================

export function ThemedSlider({ ...props }: ISettings) {
  const theme = useTheme();

  const colorProps = {
    connectionBgColor: theme.palette.primary.light,
    connectionBgColorHover: theme.palette.primary.light,
    connectionBgColorDisabled: theme.palette.action.disabledBackground,

    pointerBgColor: theme.palette.primary.main,
    pointerBgColorHover: theme.palette.primary.light,
    pointerBgColorSelected: theme.palette.primary.dark,
    pointerBgColorDisabled: theme.palette.action.disabled,
    pointerBorderColor: "transparent",

    pathBgColor: theme.palette.action.focus,
    pathBorderColor: "transparent",
    pathInnerBgColor: "transparent",

    textColor: theme.palette.text.primary,
    svgBgColor: "transparent",

    ticksColor: theme.palette.text.disabled,
    tickValuesColor: theme.palette.text.secondary,
  };

  const typographyProps = {
    tickValuesFontSize: 16,
    tickValuesFontFamily: "var(--font-bpm-ticks)",

    textFontSize: 84,
    textFontFamily: "var(--font-main-bpm)",
  };

  const sizeProps = {
    ticksWidth: 2,
    ticksHeight: 8,
    longerTicksHeight: 16,
    tickValuesDistance: 14,
    ticksDistanceToPanel: 4,

    textOffsetY: 20,

    pathThickness: 8,
    pathBorder: 0,
    pathRadius: 200,

    pointerBorder: 0,
    pointerRadius: 12,
  };

  return (
    <RoundSlider
      {...colorProps}
      {...typographyProps}
      {...sizeProps}
      {...props}
    />
  );
}
