import { Sound } from "~/model";
import { FancySlider } from "~/view/components/common";

import Typography from "@mui/material/Typography";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeMute from "@mui/icons-material/VolumeMute";

import type { FancySliderProps } from "~/view/components/common";
import type { DistributiveOmit } from "~/utils/types";

//================================================

export type VolumeSliderProps = DistributiveOmit<
  FancySliderProps,
  "iconMin" | "iconMax"
> & {
  iconPosition?: "min" | "max";
};

export function VolumeSlider({
  iconPosition = "min",
  ...props
}: VolumeSliderProps) {
  const icon =
    props.value === 0 ? (
      <VolumeMute />
    ) : props.value < 0.5 ? (
      <VolumeDown />
    ) : (
      <VolumeUp />
    );

  return (
    <FancySlider
      {...props}
      min={0}
      max={1}
      step={0.01}
      shiftStep={0.1}
      tooltip={(value) => (
        <Typography variant="caption" fontWeight="700">
          {Math.round(value * 100)}
        </Typography>
      )}
      iconMin={iconPosition === "min" ? icon : undefined}
      iconMax={iconPosition === "max" ? icon : undefined}
      onChange={(_, value, __) => {
        const newValue =
          typeof value === "number"
            ? Sound.clampVolume(value)
            : value.map(Sound.clampVolume);
        props.onChange?.(_, newValue, __);
      }}
    />
  );
}
