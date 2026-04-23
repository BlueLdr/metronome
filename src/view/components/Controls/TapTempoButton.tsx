import { useCallback } from "react";

import { MAX_BPM, MIN_BPM } from "~/utils/constants";
import { useTapTempo } from "~/utils/hooks";
import { useAppState } from "~/view/context";

import Button from "@mui/material/Button";

import type { ButtonProps } from "@mui/material/Button";
import type { UseTapTempoOptions } from "~/utils/hooks";

//================================================

export type TapTempoButtonProps = ButtonProps & Partial<UseTapTempoOptions>;

export function TapTempoButton({
  onFinish,
  onUpdate,
  sampleSize,
  ...props
}: TapTempoButtonProps) {
  const { setState } = useAppState();
  const updateBpm = useCallback(
    (value: number) => {
      const bpm = Math.round(Math.min(MAX_BPM, Math.max(MIN_BPM, value)));
      setState((s) => ({ ...s, bpm }));
      onUpdate?.(bpm);
    },
    [onUpdate, setState],
  );
  const [onClick, active] = useTapTempo({
    onUpdate: updateBpm,
    onFinish,
    sampleSize,
  });

  return (
    <Button
      variant={active ? "contained" : "outlined"}
      disableRipple={false}
      size="large"
      {...props}
      onClick={(e) => {
        onClick(e);
        props.onClick?.(e);
      }}
    >
      {active ? "Recording..." : "Tap tempo"}
    </Button>
  );
}
