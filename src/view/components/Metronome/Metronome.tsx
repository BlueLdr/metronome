import { useAppState } from "../../context";
import { Controls } from "../Controls";
import { Visualizer } from "../Visualizer";
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
      gridTemplateColumns="1fr auto 1fr"
      gridTemplateRows="auto"
      gridTemplateAreas={[
        "top top top",
        "left gauge right",
        "bottom bottom bottom",
      ]}
      gap={8}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        gridArea="gauge"
      >
        <MetronomeSlider value={state.bpm} onChange={setBpm} {...sliderProps} />
        <Visualizer size="large" />
      </Grid>

      <Controls />
    </Grid>
  );
}
