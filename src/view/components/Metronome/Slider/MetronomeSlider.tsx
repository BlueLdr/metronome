import { useEffect, useMemo, useState } from "react";
import { debounce, round } from "lodash";
import { styled } from "@mui/material/styles";

import {
  MAX_BPM,
  MAX_SLIDER_BPM,
  MIN_BPM,
  MIN_SLIDER_BPM,
} from "~/utils/constants";
import {
  getBpmFromSliderPosition,
  getSliderPositionFromBpm,
} from "~/utils/helpers";
import { useAppBpmState } from "~/utils/hooks";
import { StartStopButton } from "~/view/components/Controls";

import { SliderNumberInput } from "./SliderNumberInput";
import { ThemedSlider } from "./ThemedSlider";

import Grid from "@mui/material/Grid";

import type { ISettings, ISettingsPointer } from "blueldr-react-round-slider";

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

const increments: number[] = [];
for (let i = MIN_SLIDER_BPM; i <= MAX_SLIDER_BPM; i++) {
  const p = getSliderPositionFromBpm(i);
  const pPrev = getSliderPositionFromBpm(i - 1);
  const pNext = getSliderPositionFromBpm(i + 1);
  if (i === MIN_SLIDER_BPM) {
    increments.push(pNext - p);
  } else if (i === MAX_SLIDER_BPM) {
    increments.push(p - pPrev);
  } else {
    const avg = (Math.abs(p - pPrev) + Math.abs(p - pNext)) / 2;
    increments.push(avg);
  }
}

export type MetronomeSliderSingleValueProps = {
  value: number;
  onChange: (newValue: number) => void;
};
/*export type MetronomeSliderRangeValueProps = {
}*/

export type MetronomeSliderProps = Omit<
  ISettings,
  "pointers" | "onChange" | "min" | "max" | "step" | "arrowStep"
>;

export function MetronomeSlider(props: MetronomeSliderProps) {
  const [, setReRender] = useState(false);
  const [value, onChange] = useAppBpmState();

  const valueAsPosition = round(getSliderPositionFromBpm(value), 10);
  const handleChange = (pointers: ISettingsPointer[]) => {
    const newPosition = pointers[0].value;
    if (typeof newPosition !== "number") {
      return;
    }

    const newValue = getBpmFromSliderPosition(newPosition);

    if (newValue !== value) {
      onChange(newValue);
    } else if (valueAsPosition < newPosition) {
      onChange(Math.min(value + 1, MAX_SLIDER_BPM));
    } else if (valueAsPosition > newPosition) {
      onChange(Math.max(value - 1, MIN_SLIDER_BPM));
    } else {
      setReRender((v) => !v);
    }
  };

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

  const step = increments[value - MIN_BPM];

  return (
    <Grid
      container
      position="relative"
      sx={
        !showButtons
          ? {
              "& .MuiIconButton-root:not(:hover):not(:focus)": { opacity: 0 },
            }
          : undefined
      }
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => {
        setHovered(false);
        setShowButtons(false);
      }}
      onMouseMove={() => setShowButtons(true)}
    >
      <ThemedSlider
        pathStartAngle={120}
        pathEndAngle={60}
        min={0}
        max={getSliderPositionFromBpm(MAX_SLIDER_BPM)}
        round={10}
        step={step}
        arrowStep={step}
        enableTicks
        ticksCount={140}
        ticksGroupSize={5}
        getText={() => ""}
        getTickLabel={(v) =>
          typeof v === "string"
            ? v
            : `${Math.round(getBpmFromSliderPosition(v) / 2) * 2}`
        }
        {...props}
        pointers={[
          {
            value: getSliderPositionFromBpm(
              Math.min(MAX_SLIDER_BPM, Math.max(MIN_SLIDER_BPM, value)),
            ),
          },
        ]}
        onChange={handleChange}
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
