import { useAppState } from "../../context";
import { Controls } from "../Controls";
import { MetronomeSlider } from "./Slider/MetronomeSlider";

import Grid from "@mui/material/Grid";

import type { MetronomeSliderProps } from "./Slider/MetronomeSlider.tsx";

//================================================

export type MetronomeProps = {
  sliderProps?: Partial<MetronomeSliderProps>;
};

export function MetronomeComponent({ sliderProps }: MetronomeProps) {
  const { state, setState } = useAppState();

  const setBpm = (value: number) => setState((s) => ({ ...s, bpm: value }));

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={4}
    >
      <MetronomeSlider value={state.bpm} onChange={setBpm} {...sliderProps} />
      <Controls />
    </Grid>
  );
}
