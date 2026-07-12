import { METRONOME_CONTAINER_ID } from "~/utils/constants";
import { SavePresetButton } from "~/view/components/Presets";
import { SettingsModal } from "~/view/components/Settings";

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
      id={METRONOME_CONTAINER_ID}
      container
      display="grid"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gridTemplateColumns="1fr auto 1fr"
      gridTemplateRows="minmax(15vh, auto) auto 1fr"
      gridTemplateAreas={
        "'top top top' 'left gauge right' 'bottom bottom bottom'"
      }
      rowGap={4}
      columnGap={8}
    >
      <Grid
        container
        gridArea="left"
        justifySelf="flex-end"
        direction="column"
        spacing={4}
        alignSelf="stretch"
        justifyContent="space-evenly"
      >
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          alignSelf="flex-start"
          width="100%"
        >
          <SavePresetButton />
        </Grid>

        <Grid
          container
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
          pb={14}
        >
          <RhythmControls />
        </Grid>
        <Grid />
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
        <SettingsModal />
        <MasterVolumeSlider
          orientation="vertical"
          iconPosition="min"
          containerProps={{
            sx: { flexGrow: 1 },
          }}
        />

        <TapTempoButton
          iconOnly
          color="secondary"
          size="large"
          icon={<TouchAppRounded />}
          activeIcon={<FiberSmartRecordIcon color="error" />}
          sx={{ marginBottom: (theme) => theme.spacing(6) }}
        />
      </Grid>

      <Controls />
    </Grid>
  );
}
