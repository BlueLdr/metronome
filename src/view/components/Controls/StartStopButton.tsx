import { useMemo } from "react";

import { Measure } from "~/model";
import { useAppState } from "~/view/context";

import Fab from "@mui/material/Fab";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";

import type { FabProps } from "@mui/material/Fab";
import type { SxStyleProps } from "~/theme";

//================================================

export type StartStopButtonProps = FabProps & { iconSx?: SxStyleProps };

export function StartStopButton({ iconSx, ...props }: StartStopButtonProps) {
  const { metronome, playing, state } = useAppState();

  const measures = useMemo(
    () => state.measures.map((m) => new Measure(m.timeSignature, m.notes)),
    [state.measures],
  );

  return (
    <Fab
      color={playing ? "error" : "primary"}
      size="large"
      onClick={() => (playing ? metronome.stop() : metronome.start(measures))}
      sx={{
        width: (theme) => theme.spacing(16),
        height: (theme) => theme.spacing(16),
      }}
      {...props}
    >
      {playing ? (
        <PauseRounded fontSize="large" sx={iconSx} />
      ) : (
        <PlayArrowRounded fontSize="large" sx={iconSx} />
      )}
    </Fab>
  );
}
