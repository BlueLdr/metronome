"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { loadStorageSafely } from "../helpers";

import { useValueRef } from "./data";

import type { TypeCheckFunction } from "../types";

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
