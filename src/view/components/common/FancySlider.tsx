import { useEffect, useRef, useState } from "react";

import { mergeSlotProps } from "@mui/material/utils";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import type * as Popper from "@popperjs/core";
import type { SliderProps } from "@mui/material/Slider";

//================================================

export type FancySliderProps = Omit<SliderProps, "value" | "orientation"> & {
  value: number;
  iconMin?: React.ReactNode;
  iconMax?: React.ReactNode;
  tooltip?: boolean | ((value: number) => React.ReactNode);
} & (
    | {
        orientation?: "horizontal";
        tooltipSide?: "top" | "bottom";
      }
    | {
        orientation: "vertical";
        tooltipSide?: "left" | "right";
      }
  );

export function FancySlider({
  iconMin,
  iconMax,
  tooltip,
  tooltipSide,
  ...props
}: FancySliderProps) {
  const [thumbRef, setThumbRef] = useState<HTMLSpanElement | null>(null);
  const popperRef = useRef<Popper.Instance>(null);
  const thumbSlotProps = tooltip
    ? // eslint-disable-next-line react-hooks/refs
      mergeSlotProps(props.slotProps?.thumb, {
        ref: setThumbRef,
        onAnimationEnd: () => popperRef.current?.update(),
        onTransitionEnd: () => popperRef.current?.update(),
      })
    : props.slotProps?.thumb;

  const slider = (
    <Slider
      {...props}
      slotProps={{ ...props.slotProps, thumb: thumbSlotProps }}
    />
  );

  useEffect(() => {
    popperRef.current?.update();
  }, [props.value]);

  if (!iconMin && !iconMax && !tooltip) {
    return slider;
  }

  tooltipSide =
    (tooltipSide ?? props.orientation === "vertical") ? "right" : "top";

  return (
    <Stack
      direction={props.orientation === "vertical" ? "column" : "row"}
      gap={props.size === "small" ? 1 : 2}
      alignItems="center"
      justifyContent="center"
    >
      {iconMin && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize={props.size}
        >
          {iconMin}
        </Box>
      )}
      {tooltip ? (
        <Tooltip
          arrow
          title={
            typeof tooltip === "boolean" ? props.value : tooltip(props.value)
          }
          placement={tooltipSide}
          slotProps={{
            popper: {
              popperOptions: {
                modifiers: [{ name: "flip" }],
              },
              anchorEl: thumbRef,
              popperRef,
            },
          }}
        >
          {slider}
        </Tooltip>
      ) : (
        slider
      )}
      {iconMax && <Box fontSize={props.size}>{iconMax}</Box>}
    </Stack>
  );
}
