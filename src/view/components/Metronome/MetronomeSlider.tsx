import { RoundSlider } from "blueldr-react-round-slider";
import type { ISettings, ISettingsPointer } from "blueldr-react-round-slider";
import { useState } from "react";
import { MAX_BPM, MIN_BPM } from "../../../utils/constants";
import {
  getBpmFromSliderPosition,
  getSliderPositionFromBpm,
  roundToNearestBpmPosition,
} from "../../../utils/helpers";

//================================================

const increments: number[] = [];
for (let i = MIN_BPM; i <= MAX_BPM; i++) {
  const p = getSliderPositionFromBpm(i);
  const pPrev = getSliderPositionFromBpm(i - 1);
  const pNext = getSliderPositionFromBpm(i + 1);
  if (i === MIN_BPM) {
    increments.push(pNext - p);
  } else if (i === MAX_BPM) {
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

export type MetronomeSliderInheritedProps = Omit<
  ISettings,
  "pointers" | "onChange" | "min" | "max" | "step" | "arrowStep"
>;
export type MetronomeSliderProps = MetronomeSliderInheritedProps &
  MetronomeSliderSingleValueProps;

export function MetronomeSlider({
  value = 80,
  onChange,
  ...props
}: MetronomeSliderProps) {
  const [, setReRender] = useState(false);
  const valueAsPosition = getSliderPositionFromBpm(value);
  const handleChange = (pointers: ISettingsPointer[]) => {
    const newPosition = pointers[0].value;
    if (typeof newPosition === "string") {
      return;
    }

    const newValue = getBpmFromSliderPosition(newPosition);
    if (newValue !== value) {
      onChange(newValue);
    } else if (valueAsPosition < newPosition) {
      onChange(Math.min(value + 1, MAX_BPM));
    } else if (valueAsPosition > newPosition) {
      onChange(Math.max(value - 1, MIN_BPM));
    } else {
      setReRender((v) => !v);
    }
  };

  const step = increments[value - MIN_BPM];

  return (
    <RoundSlider
      pathStartAngle={120}
      pathEndAngle={60}
      min={0}
      max={getSliderPositionFromBpm(MAX_BPM)}
      round={10}
      step={step}
      arrowStep={step}
      enableTicks
      ticksCount={145}
      ticksGroupSize={5}
      getText={(values, settings) =>
        values
          .map((v) => (typeof v === "string" ? v : getBpmFromSliderPosition(v)))
          .join(settings.textBetween ?? " - ")
      }
      getTickLabel={(v) =>
        typeof v === "string"
          ? v
          : `${roundToNearestBpmPosition(getBpmFromSliderPosition(v))}`
      }
      {...props}
      pointers={[{ value: getSliderPositionFromBpm(value) }]}
      onChange={handleChange}
    />
  );
}
