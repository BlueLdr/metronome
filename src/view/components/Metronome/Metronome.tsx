import { Controls, MasterVolumeSlider, RhythmControls } from "../Controls";
import { TapTempoButton } from "../Controls/TapTempoButton";
import { MetronomeSlider } from "./Slider/MetronomeSlider";

import TouchAppRounded from "@mui/icons-material/TouchAppRounded";
import FiberSmartRecordIcon from "@mui/icons-material/FiberSmartRecordRounded";
import Grid from "@mui/material/Grid";

import type { MetronomeSliderProps } from "./Slider/MetronomeSlider.tsx";

//================================================

export type MetronomeProps = {
  sliderProps?: Partial<MetronomeSliderProps>;
};

export function MetronomeComponent({ sliderProps }: MetronomeProps) {
  return (
    <Grid
      container
      display="grid"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gridTemplateColumns="1fr auto 1fr"
      gridTemplateRows="minmax(20vh, auto) auto 1fr"
      gridTemplateAreas={
        "'top top top' 'left gauge right' 'bottom bottom bottom'"
      }
      rowGap={4}
      columnGap={8}
    >
      <Grid container gridArea="left" justifySelf="flex-end">
        <RhythmControls />
      </Grid>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        gridArea="gauge"
      >
        <MetronomeSlider {...sliderProps} />
      </Grid>
      <Grid
        container
        gridArea="right"
        justifySelf="flex-start"
        direction="column"
        alignSelf="stretch"
        alignItems="center"
        justifyContent="center"
        gap={8}
      >
        <div />
        <MasterVolumeSlider
          orientation="vertical"
          iconPosition="min"
          sx={{ height: (theme) => theme.spacing(50) }}
        />

        <TapTempoButton
          iconOnly
          color="secondary"
          size="large"
          icon={<TouchAppRounded />}
          activeIcon={<FiberSmartRecordIcon color="error" />}
        />
      </Grid>

      <Controls />
    </Grid>
  );
}
