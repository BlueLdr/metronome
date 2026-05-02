import { tickValues } from "~/utils/constants";

//================================================

const a = 40;
const b = 0.0435;

export const getBpmFromSliderPosition = (position: number) =>
  Math.round(a * Math.pow(Math.E, b * position));
export const getSliderPositionFromBpm = (value: number) =>
  Math.log(value / a) / b;

export const roundToNearestDiscreteValue = (
  value: number,
  discreteValues: number[],
) => {
  const values = discreteValues.slice().sort();
  let closest = values[0];
  for (const tick of values) {
    if (Math.abs(tick - value) <= Math.abs(closest - value)) {
      closest = tick;
    } else {
      return closest;
    }
  }
  return closest;
};

export const roundToNearestBpmPosition = (value: number) =>
  roundToNearestDiscreteValue(value, tickValues);
