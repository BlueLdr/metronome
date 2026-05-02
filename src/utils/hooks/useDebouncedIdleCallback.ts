import { debounce } from "lodash";
import { useMemo, useRef } from "react";

import { useValueRef } from "~/utils/hooks/data";

//================================================

export const useDebouncedIdleCallback = <
  Args extends any[],
  Func extends (...args: Args) => void,
>(
  ...args: Parameters<typeof debounce<Func>>
) => {
  const [callback, wait, options] = args;
  const idleCallbackIdRef = useRef<{ current: number }>(undefined);
  const callbackRef = useValueRef(callback);

  return useMemo(
    () =>
      debounce(
        (...args2: Args) => {
          if (idleCallbackIdRef.current) {
            cancelIdleCallback(idleCallbackIdRef.current.current);
          }
          const id = requestIdleCallback(() => {
            idleCallbackIdRef.current = undefined;
            callbackRef.current?.(...args2);
          });
          idleCallbackIdRef.current = { current: id };
        },
        wait,
        options,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wait, JSON.stringify(options)],
  );
};
