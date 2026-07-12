import { round } from "lodash";
import { useState } from "react";

import { MAX_SLIDER_BPM, MIN_BPM, MIN_SLIDER_BPM } from "~/utils/constants";
import {
  getBpmFromSliderPosition,
  getSliderPositionFromBpm,
} from "~/utils/helpers";
import { useAppState } from "~/view/context";

import type { ISettings, ISettingsPointer } from "blueldr-react-round-slider";

//================================================

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

export type MetronomeSliderProps = Omit<
  ISettings,
  "pointers" | "onChange" | "min" | "max" | "step" | "arrowStep"
>;

export const useMetronomeSlider = (props: MetronomeSliderProps) => {
  const [, setReRender] = useState(false);
  const { setBpm: onChange, state } = useAppState();
  const value = state.tempo.bpm;

  const valueAsPosition = round(getSliderPositionFromBpm(value), 10);
  const handleChange = (pointers: ISettingsPointer[]) => {
    const newPosition = pointers[0].value;
    if (typeof newPosition !== "number") {
      return;
    }

    const newValue = getBpmFromSliderPosition(newPosition);

    if (newValue !== value) {
      onChange(newValue);
    } else if (
      newPosition >
      valueAsPosition +
        0.5 *
          Math.abs(
            round(getSliderPositionFromBpm(value + 1), 10) - valueAsPosition,
          )
    ) {
      onChange(Math.min(value + 1, MAX_SLIDER_BPM));
    } else if (
      newPosition <
      valueAsPosition -
        0.5 *
          Math.abs(
            round(getSliderPositionFromBpm(value - 1), 10) - valueAsPosition,
          )
    ) {
      onChange(Math.max(value - 1, MIN_SLIDER_BPM));
    } else {
      onChange(newValue);
      setReRender((v) => !v);
    }
  };

  const step = increments[value - MIN_BPM];

  const getTickLabel = (v: string | number) =>
    typeof v === "string"
      ? v
      : `${Math.round(getBpmFromSliderPosition(v) / 2) * 2}`;

  return {
    pathStartAngle: 120,
    pathEndAngle: 60,
    min: 0,
    max: getSliderPositionFromBpm(MAX_SLIDER_BPM),
    round: 10,
    step: step,
    arrowStep: step,
    ticksCount: 140,
    ticksGroupSize: 5,
    getText: () => "",
    enableTicks: true,
    getTickLabel,
    ...props,
    onChange: handleChange,
    pointers: [
      {
        value: getSliderPositionFromBpm(
          Math.min(MAX_SLIDER_BPM, Math.max(MIN_SLIDER_BPM, value)),
        ),
      },
    ],
  } satisfies Partial<ISettings>;
};
