import { roundToNearestDiscreteValue } from "~/utils/helpers/math";
import { RollingAverage } from "~/utils/helpers/rolling-average";

import type { TypeCheckFunction } from "~/utils/types";

//================================================

export const loadStorageSafely = <T extends string | number | boolean | object>(
  key: string,
  fallback: T,
  validate?: TypeCheckFunction<T>,
): T => {
  if (typeof window === "undefined") {
    return fallback;
  }
  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) {
    return fallback;
  }
  try {
    const value = JSON.parse(rawValue);
    if (validate && !validate(value)) {
      return fallback;
    }
    return value;
  } catch {
    return fallback;
  }
};

export const getScreenFrameTime = async (samples = 30) =>
  new Promise<number>((resolve) => {
    const state: {
      prevTimestamp: number;
      avg: RollingAverage | undefined;
    } = {
      prevTimestamp: 0,
      avg: undefined,
    };

    const roundFrameTime = (avgFrameTime: number) =>
      1000 /
      roundToNearestDiscreteValue(
        1000 / avgFrameTime,
        // common refresh rates
        [60, 75, 90, 100, 120, 144, 165, 170, 180, 200, 240, 300, 360],
      );

    const tick = () => {
      requestAnimationFrame((timestamp) => {
        if (state.prevTimestamp) {
          if (state.avg) {
            const avg = state.avg.next(timestamp - state.prevTimestamp);
            if (state.avg.count >= samples) {
              return resolve(roundFrameTime(avg));
            }
          } else {
            state.avg = new RollingAverage(
              samples,
              timestamp - state.prevTimestamp,
            );
          }
        }
        state.prevTimestamp = timestamp;
        tick();
      });
    };
    requestIdleCallback(tick);
  });
