import { useEffect, useMemo } from "react";
import { useAppState } from "../../context";
import { Metronome, Rhythm } from "../../../model";
import {
  MetronomeSlider,
  type MetronomeSliderProps,
} from "./MetronomeSlider.tsx";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import { throttle } from "lodash";

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
      <ToggleButton
        color="primary"
        value={playing}
        onChange={() =>
          playing
            ? metronome.stop()
            : metronome.start(
                new Rhythm(state.rhythm.timeSignature, state.rhythm.notes),
              )
        }
      >
        {playing ? "Stop" : "Start"}
      </ToggleButton>
    </Grid>
  );
}
