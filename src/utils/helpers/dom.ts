import type { TypeCheckFunction } from "../types";

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
