import { throttle } from "lodash";
import { useEffect, useMemo } from "react";

//================================================

export const useThrottledCallback = <Func extends (...args: any[]) => unknown>(
  callback: Func,
  interval: number,
  deps: unknown[],
) => {
  const throttledCallback = useMemo(
    () => throttle(callback, interval),
    // eslint-disable-next-line react-hooks/use-memo,react-hooks/exhaustive-deps
    [interval, ...deps],
  );
  useEffect(() => {
    return () => throttledCallback.cancel();
  }, [throttledCallback]);

  return throttledCallback;
};

export const useThrottledUpdate = <Value>(
  callback: (value: Value) => void,
  interval: number,
  deps: unknown[],
  value: Value,
  getEqualityValue: (
    value: Value,
  ) => Value | string | number | boolean | undefined | null = (v) => v,
) => {
  const setValue = useThrottledCallback(callback, interval, deps);

  const equalityValue = getEqualityValue(value);
  useEffect(() => {
    setValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equalityValue, setValue]);
};
