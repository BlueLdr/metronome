import { mergeClassNames } from "@base-ui/react";
import * as React from "react";
import { useCallback } from "react";

import { MAX_BPM, MIN_BPM } from "~/utils/constants";
import { useTapTempo } from "~/utils/hooks";
import { useAppState, useTapTempoContext } from "~/view/context";

import { useForkRef } from "@mui/material/utils";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import type { ButtonProps } from "@mui/material/Button";
import type { UseTapTempoOptions } from "~/utils/hooks";

//================================================

export type TapTempoButtonProps = Partial<UseTapTempoOptions> &
  Omit<ButtonProps, "startIcon" | "endIcon" | "children"> &
  (
    | {
        iconOnly?: false;
        children?: React.ReactNode;
        activeChildren?: React.ReactNode;
        icon?: React.ReactNode;
        activeIcon?: React.ReactNode;
      }
    | {
        iconOnly: true;
        children?: React.ReactNode;
        activeChildren?: React.ReactNode;
        icon: React.ReactNode;
        activeIcon?: React.ReactNode;
      }
  );

export function TapTempoButton({
  onFinish,
  onUpdate,
  sampleSize,
  children = "Tap Tempo",
  activeChildren = "Recording...",
  icon,
  activeIcon = icon,
  iconOnly,
  ...props
}: TapTempoButtonProps) {
  const { setButton } = useTapTempoContext();
  const { setBpm } = useAppState();

  const updateBpm = useCallback(
    (value: number) => {
      const bpm = Math.round(Math.min(MAX_BPM, Math.max(MIN_BPM, value)));
      setBpm(bpm);
      onUpdate?.(bpm);
    },
    [onUpdate, setBpm],
  );

  const [onClick, active] = useTapTempo({
    onUpdate: updateBpm,
    onFinish,
    sampleSize,
  });

  const ref = useForkRef(props.ref, setButton);

  if (iconOnly) {
    const scale = props.size === "large" ? 16 : props.size === "small" ? 8 : 12;
    return (
      <Tooltip
        title={
          <Typography variant="overline">
            {active ? activeChildren : children}
          </Typography>
        }
        enterDelay={100}
      >
        <Button
          variant={active ? "contained" : "outlined"}
          disableRipple={false}
          {...props}
          ref={ref}
          className={mergeClassNames(
            active ? "TapTempo-active" : undefined,
            props.className,
          )}
          sx={{
            borderRadius: (theme) => theme.spacing(999),
            width: (theme) => theme.spacing(scale),
            height: (theme) => theme.spacing(scale),
            minWidth: 0,
            minHeight: 0,
            maxHeight: "none",
            "& .MuiButton-startIcon": {
              margin: 0,
            },
            "&:not(:hover):not(:active):not(:focus):not(.Mui-focused):not(.TapTempo-active)":
              {
                opacity: 0.7,
              },
            ...props.sx,
          }}
          onClick={(e) => {
            onClick(e);
            props.onClick?.(e);
          }}
        >
          {active ? activeIcon : icon}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button
      variant={active ? "contained" : "outlined"}
      disableRipple={false}
      size="large"
      {...props}
      ref={ref}
      startIcon={active ? activeIcon : icon}
      onClick={(e) => {
        onClick(e);
        props.onClick?.(e);
      }}
    >
      {active ? (activeChildren ?? "Recording...") : (children ?? "Tap tempo")}
    </Button>
  );
}
