import { throttle } from "lodash";
import { useEffect, useMemo } from "react";

//================================================

export const useThrottledCallback = <
  Func extends (...args: unknown[]) => unknown,
>(
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
) => {
  const setValue = useThrottledCallback(callback, interval, deps);

  useEffect(() => {
    setValue(value);
  }, [value, setValue]);
};
