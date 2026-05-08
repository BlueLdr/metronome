import { useMemo } from "react";

import { Rhythm } from "~/model";
import { useAppState } from "~/view/context";

import Fab from "@mui/material/Fab";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";

import type { FabProps } from "@mui/material/Fab";

//================================================

export type StartStopButtonProps = FabProps;

export function StartStopButton(props: StartStopButtonProps) {
  const { metronome, playing, state } = useAppState();

  const rhythm = useMemo(
    () => new Rhythm(state.rhythm.timeSignature, state.rhythm.notes),
    [state.rhythm],
  );

  return (
    <Fab
      color={playing ? "error" : "primary"}
      size="large"
      onClick={() => (playing ? metronome.stop() : metronome.start(rhythm))}
      sx={{
        width: (theme) => theme.spacing(16),
        height: (theme) => theme.spacing(16),
      }}
      {...props}
    >
      {playing ? (
        <PauseRounded fontSize="large" />
      ) : (
        <PlayArrowRounded fontSize="large" />
      )}
    </Fab>
  );
}
