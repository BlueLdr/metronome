import { throttle } from "lodash";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { useValueRef } from "./data";

import type { TransitionProps } from "@mui/material/transitions";

//================================================

/**
 * Sets the open flag for a modal based on the presence of a target record.
 * Useful for controlling a modal that targets one of many records on the page.
 * NOTE: Make sure you pass TransitionProps to the modal.
 */
export const useModalTarget = <T>(target?: T) => {
  const [open, setOpen] = useState(target !== undefined);
  const [storedTarget, setStoredTarget] = useState(target);

  // when target changes
  useEffect(() => {
    // if target exists, store it
    if (target !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStoredTarget(target);
    }
    // open or close the modal
    setOpen(target !== undefined);
  }, [target]);

  const shouldClear = useValueRef(!!storedTarget && target === undefined);
  const transitionProps = useMemo<TransitionProps>(() => {
    // clear the stored target AFTER the modal close animation finishes
    // this prevents UI flashing after you trigger the modal close but
    // before the animation finishes
    return {
      onExited: () => {
        if (shouldClear.current) {
          setStoredTarget(undefined);
        }
      },
    };
  }, [shouldClear]);

  return [open, storedTarget, transitionProps, setStoredTarget] as const;
};

//================================================

const getWindowSize = () => window.innerWidth;

export const useWindowSize = (debounceDelay: number = 10) => {
  const subscribe = useCallback(
    (listener: () => void) => {
      const throttledListener = throttle(listener, debounceDelay);
      window.addEventListener("resize", throttledListener);
      return () => window.removeEventListener("resize", throttledListener);
    },
    [debounceDelay],
  );

  return useSyncExternalStore(subscribe, getWindowSize);
};
