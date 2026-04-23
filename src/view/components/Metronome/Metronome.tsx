import { useEffect, useMemo } from "react";
import { throttle } from "lodash";

import { Metronome, Rhythm } from "~/model";

import { useAppState } from "../../context";
import { MetronomeSlider } from "./Slider/MetronomeSlider";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import type { MetronomeSliderProps } from "./Slider/MetronomeSlider.tsx";

//================================================

export type MetronomeProps = {
  sliderProps?: Partial<MetronomeSliderProps>;
};

const bpmChangeThrottleInterval = 250;

export function MetronomeComponent({ sliderProps }: MetronomeProps) {
  const { state, setState, playing, setPlaying } = useAppState();
  const metronome = useMemo(
    () => new Metronome({ bpm: state.bpm, setPlaying, beatDivision: 4 }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setPlaying],
  );

  const updateBpm = useMemo(
    () =>
      throttle((value: number) => {
        console.log(`bpm updated: ${value}`);
        metronome.setBpm(value);
      }, bpmChangeThrottleInterval),
    [metronome],
  );
  useEffect(() => {
    updateBpm(state.bpm);
  }, [state.bpm, updateBpm]);
  useEffect(() => {
    return () => updateBpm.cancel();
  }, [updateBpm]);

  const setBpm = (value: number) => setState((s) => ({ ...s, bpm: value }));

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <MetronomeSlider value={state.bpm} onChange={setBpm} {...sliderProps} />
      <Button
        color={playing ? "error" : "primary"}
        variant="contained"
        size="large"
        onClick={() =>
          playing
            ? metronome.stop()
            : metronome.start(
                new Rhythm(state.rhythm.timeSignature, state.rhythm.notes),
              )
        }
        sx={{ width: (theme) => theme.spacing(32) }}
      >
        {playing ? "Stop" : "Start"}
      </Button>
    </Grid>
  );
}
