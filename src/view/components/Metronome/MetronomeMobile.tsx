import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";

import { METRONOME_CONTAINER_ID } from "~/utils/constants";

import { RhythmControlsMobile } from "../Controls";
import { MetronomeSliderMobile, SliderNumberInputMobile } from "./Slider";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import type { MetronomeProps } from "./Metronome";

//================================================

export function MetronomeMobileComponent({ sliderProps }: MetronomeProps) {
  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [inputPortalElement, setInputPortalElement] =
    useState<HTMLElement | null>(null);
  return (
    <Grid
      id={METRONOME_CONTAINER_ID}
      container
      // display="grid"
      direction="column"
      // alignItems="center"
      // justifyContent="center"
      // gridTemplateColumns="1fr auto 1fr"
      // gridTemplateRows="minmax(15vh, auto) auto 1fr"
      // gridTemplateAreas={
      //   "'top top top' 'left gauge right' 'bottom bottom bottom'"
      // }
      rowGap={2}
      // columnGap={8}
      pt={isSm ? 4 : 8}
    >
      <Box>
        <MetronomeSliderMobile
          {...sliderProps}
          inputPortalElementRef={setInputPortalElement}
        />
      </Box>
      <RhythmControlsMobile />
      <SliderNumberInputMobile inputPortalElement={inputPortalElement} />
    </Grid>
  );
}
