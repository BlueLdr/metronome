"use client";

import { useCallback, useMemo, useReducer, useSyncExternalStore } from "react";

import { loadStorageSafely } from "~/utils/helpers";

import { useValueRef } from "./data";

import type { TypeCheckFunction } from "~/utils/types";

//================================================

const subscribe = (listener: () => void) => {
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
};

export const useStorageState = <T extends string | number | boolean | object>(
  key: string,
  fallback: T | (() => T),
  validate?: TypeCheckFunction<T>,
) => {
  const fallbackRef = useValueRef(fallback);
  const getSnapshot = useCallback(
    () =>
      JSON.stringify(
        loadStorageSafely<T>(
          key,
          typeof fallbackRef.current === "function"
            ? fallbackRef.current()
            : fallbackRef.current,
          validate,
        ),
      ),
    [fallbackRef, key, validate],
  );
  const rawValue = useSyncExternalStore(subscribe, getSnapshot);
  const value = useMemo(() => JSON.parse(rawValue) as T, [rawValue]);

  const valueRef = useValueRef(value);
  const setValue = useCallback(
    (state: React.SetStateAction<T>) => {
      const newValue =
        typeof state === "function" ? state(valueRef.current) : state;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue,
          oldValue: JSON.stringify(valueRef.current),
        }),
      );
    },
    [key, valueRef],
  );

  return [value, setValue] as const;
};

//================================================

export const useStorageReducer = <
  T extends string | number | boolean | object,
  A extends React.AnyActionArg,
>(
  key: string,
  fallback: T | (() => T),
  reducer: (prevState: T, ...action: A) => T,
  validate?: TypeCheckFunction<T>,
) => {
  const fallbackRef = useValueRef(fallback);
  const getSnapshot = useCallback(
    () =>
      JSON.stringify(
        loadStorageSafely<T>(
          key,
          typeof fallbackRef.current === "function"
            ? fallbackRef.current()
            : fallbackRef.current,
          validate,
        ),
      ),
    [fallbackRef, key, validate],
  );
  const rawValue = useSyncExternalStore(subscribe, getSnapshot);
  const value = useMemo(() => JSON.parse(rawValue) as T, [rawValue]);

  const valueRef = useValueRef(value);
  const setValue = useCallback(
    (state: React.SetStateAction<T>) => {
      const newValue =
        typeof state === "function" ? state(valueRef.current) : state;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue,
          oldValue: JSON.stringify(valueRef.current),
        }),
      );
    },
    [key, valueRef],
  );

  const wrappedReducer = useCallback(
    (_: undefined, ...action: A) => {
      requestAnimationFrame(() => {
        setValue((prevState) => reducer(prevState, ...action));
      });
      return undefined;
    },
    [reducer, setValue],
  );

  // eslint-disable-next-line react-hooks/refs
  const [, dispatch] = useReducer(wrappedReducer, undefined);

  return [value, dispatch] as const;
};
