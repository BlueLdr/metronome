import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { styled } from "@mui/material/styles";

import { MAX_BPM, MIN_BPM } from "~/utils/constants";
import { useAppState } from "~/view/context";
import { StartStopButton } from "~/view/components/Controls";

import { useMetronomeSlider } from "./useMetronomeSlider";
import { SliderNumberInput } from "./SliderNumberInput";
import { ThemedSlider } from "./ThemedSlider";

import Grid from "@mui/material/Grid";

import type { ISettings } from "blueldr-react-round-slider";

//================================================

const TextContainer = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
`;
const ButtonContainer = styled("div")`
  position: absolute;
  bottom: 12%;
  left: 50%;
  transform: translate(-50%, 50%);
  z-index: 5;
`;

export type MetronomeSliderProps = Omit<
  ISettings,
  "pointers" | "onChange" | "min" | "max" | "step" | "arrowStep"
>;

export function MetronomeSlider({
  pathRadius = 200,
  ...props
}: MetronomeSliderProps) {
  const isTouchDevice = useMediaQuery("(pointer: coarse)");
  const { setBpm: onChange, state } = useAppState();
  const value = state.tempo.bpm;

  const sliderProps = useMetronomeSlider(props);

  const [hovered, setHovered] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const hideButtons = useMemo(
    () => debounce(() => setShowButtons(false), 3000),
    [],
  );

  useEffect(() => {
    if (showButtons) {
      hideButtons();
      return () => hideButtons.cancel();
    }
  }, [showButtons, hideButtons]);

  return (
    <Grid
      container
      position="relative"
      sx={{
        ...(!showButtons && !isTouchDevice
          ? {
              "& .MuiIconButton-root:not(:hover):not(:focus)": { opacity: 0 },
            }
          : undefined),
        "--slider-radius": 200,
      }}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => {
        setHovered(false);
        setShowButtons(false);
      }}
      onMouseMove={() => setShowButtons(true)}
    >
      <ThemedSlider
        {...sliderProps}
        pathRadius={pathRadius}
        mousewheelDisabled={!hovered}
      />
      <TextContainer>
        <SliderNumberInput
          value={value}
          smallStep={1}
          largeStep={value < 120 ? 2 : 4}
          onInput={(e) => {
            const newValue = Number((e.target as HTMLInputElement).value);
            if (!isNaN(newValue)) {
              onChange(Math.max(MIN_BPM, Math.min(MAX_BPM, newValue)));
            }
          }}
          onValueChange={(newValue) => {
            if (newValue != null) {
              onChange(Math.max(MIN_BPM, Math.min(MAX_BPM, newValue)));
            }
          }}
          min={MIN_BPM}
          max={MAX_BPM}
        />
      </TextContainer>
      <ButtonContainer>
        <StartStopButton />
      </ButtonContainer>
    </Grid>
  );
}
