"use client";

import { useLayoutEffect } from "react";

//================================================

export type ResizeObserverEntryCallback = (
  entry: ResizeObserverEntry,
  observer: ResizeObserver,
) => void;

const map = new Map<Element, ResizeObserverEntryCallback>();
const observer =
  "ResizeObserver" in window
    ? new ResizeObserver((entries, observer) => {
        for (const entry of entries) {
          const callback = map.get(entry.target);
          if (callback) {
            callback(entry, observer);
          }
        }
      })
    : undefined;

export const useResizeObserver = (
  element: Element | null,
  callback: ResizeObserverEntryCallback,
) => {
  useLayoutEffect(() => {
    if (element) {
      map.set(element, callback);
      return () => {
        map.delete(element);
      };
    }
  }, [element, callback]);

  useLayoutEffect(() => {
    if (element) {
      observer?.observe(element);
      return () => observer?.unobserve(element);
    }
  }, [element]);
};
