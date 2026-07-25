import { useCallback, useRef, useState } from "react";

import { DEFAULT_TAP_TEMPO_SAMPLE_SIZE, MINUTE } from "~/utils/constants";
import { RollingAverage } from "~/utils/helpers";
import { useAppState } from "~/view/context";

import { useValueRef } from "./data";

//================================================

export type UseTapTempoOptions = {
  onUpdate: (value: number) => void;
  sampleSize?: number;
  onFinish?: (value: number) => void;
};

export const useTapTempo = (options: UseTapTempoOptions) => {
  const { state } = useAppState();

  const {
    sampleSize = state.measures.reduce(
      (max, m) => Math.max(max, m.timeSignature.count),
      1,
    ),
    onUpdate,
    onFinish,
  } = options;

  const [rollingAverage, setRollingAverage] = useState<
    RollingAverage | undefined
  >();
  const timer = useRef<number>(null);

  const [active, setActive] = useState(false);
  const [previousTime, setPreviousTime] = useState<number>();
  const previousTimeRef = useValueRef(previousTime);

  const onTap = useCallback(
    (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
      if (
        e.defaultPrevented ||
        (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Space")
      ) {
        return;
      }

      setActive(true);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        if (!rollingAverage) {
          return;
        }
        onFinish?.(Math.round(MINUTE / rollingAverage.value));
        setPreviousTime(undefined);
        setActive(false);
        setRollingAverage(undefined);
      }, 2000);

      const now = Date.now();
      if (previousTimeRef.current) {
        const difference = now - previousTimeRef.current;
        if (!rollingAverage) {
          setRollingAverage(
            new RollingAverage(
              Math.max(sampleSize, DEFAULT_TAP_TEMPO_SAMPLE_SIZE),
              difference,
            ),
          );
        } else {
          const nextAvg = rollingAverage.next(difference);
          onUpdate(Math.round(MINUTE / nextAvg));
        }
      }
      setPreviousTime(now);
    },
    [onFinish, onUpdate, previousTimeRef, rollingAverage, sampleSize],
  );

  return [onTap, active] as const;
};
