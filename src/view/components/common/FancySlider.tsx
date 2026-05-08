import { useEffect, useRef, useState } from "react";

import { mergeSlotProps } from "@mui/material/utils";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import type * as Popper from "@popperjs/core";
import type { SliderProps } from "@mui/material/Slider";
import type { StackProps } from "@mui/material/Stack";

//================================================

export type FancySliderProps = Omit<SliderProps, "value" | "orientation"> & {
  value: number;
  iconMin?: React.ReactNode;
  iconMax?: React.ReactNode;
  tooltip?: boolean | ((value: number) => React.ReactNode);
  containerProps?: StackProps;
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
  containerProps,
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

  const startIcon = props.orientation === "vertical" ? iconMax : iconMin;
  const endIcon = props.orientation === "vertical" ? iconMin : iconMax;

  return (
    <Stack
      gap={
        (props.size === "small" ? 1 : 2) *
        (props.orientation === "vertical" ? 2 : 1)
      }
      alignItems="center"
      justifyContent="center"
      {...containerProps}
      direction={props.orientation === "vertical" ? "column" : "row"}
    >
      {startIcon && (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          fontSize={props.size}
        >
          {startIcon}
        </Grid>
      )}
      {tooltip ? (
        <Tooltip
          arrow
          title={
            <Typography
              variant="caption"
              fontFamily="var(--font-number-input)"
              fontWeight="700"
            >
              {typeof tooltip === "boolean"
                ? props.value
                : tooltip(props.value)}
            </Typography>
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
      {endIcon && (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          fontSize={props.size}
        >
          {endIcon}
        </Grid>
      )}
    </Stack>
  );
}
