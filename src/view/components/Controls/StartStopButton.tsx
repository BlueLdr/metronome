import { useMemo } from "react";

import { Rhythm } from "~/model";
import { useAppState } from "~/view/context";

import Button from "@mui/material/Button";

import type { ButtonProps } from "@mui/material/Button";

//================================================

export type StartStopButtonProps = ButtonProps;

export function StartStopButton(props: StartStopButtonProps) {
  const { metronome, playing, state } = useAppState();

  const rhythm = useMemo(
    () => new Rhythm(state.rhythm.timeSignature, state.rhythm.notes),
    [state.rhythm],
  );

  return (
    <Button
      color={playing ? "error" : "primary"}
      variant="contained"
      size="large"
      onClick={() => (playing ? metronome.stop() : metronome.start(rhythm))}
      sx={{ minWidth: (theme) => theme.spacing(32) }}
      fullWidth
      {...props}
    >
      {playing ? "Stop" : "Start"}
    </Button>
  );
}
