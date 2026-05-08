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

// account for stupid js rounding
export const isInt = (num: number) =>
  Math.round(num * 1e6) / 1e6 === Math.round(num);

//================================================

const bpmJumpIntervalConfig = [
  { range: [-Infinity, 60], interval: 2 },
  { range: [60, 72], interval: 3 },
  { range: [72, 120], interval: 4 },
  { range: [120, 144], interval: 6 },
  { range: [144, 240], interval: 8 },
  { range: [240, 300], interval: 10 },
  { range: [300, 360], interval: 12 },
  { range: [360, 512], interval: 16 },
  { range: [512, Infinity], interval: 24 },
] satisfies Array<{ interval: number; range: [number, number] }>;

export const getBpmJumpInterval = (curValue: number, direction: 1 | -1) => {
  const item = bpmJumpIntervalConfig.find((i, index, arr) => {
    const nextInterval = (arr[index + 1] ?? i).interval;
    return direction > 0
      ? curValue >= i.range[0] && curValue < i.range[1]
      : curValue > i.range[0] + i.interval &&
          curValue <= i.range[1] + nextInterval;
  });
  return item?.interval ?? 1;
};
