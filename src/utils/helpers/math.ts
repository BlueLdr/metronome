import { tickValues } from "../constants";

//================================================

const a = 40;
const b = 0.0435;

export const getBpmFromSliderPosition = (position: number) =>
  Math.round(a * Math.pow(Math.E, b * position));
export const getSliderPositionFromBpm = (value: number) =>
  Math.log(value / a) / b;

export const roundToNearestBpmPosition = (value: number) => {
  let closest = tickValues[0];
  for (const tick of tickValues) {
    if (Math.abs(tick - value) <= Math.abs(closest - value)) {
      closest = tick;
    } else {
      return closest;
    }
  }
  return closest;
};
