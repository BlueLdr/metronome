import { useRef, useState } from "react";

//================================================

export const useValueRef = <T>(value: T) => {
  const value_ref = useRef<T>(value);
  // eslint-disable-next-line react-hooks/refs
  value_ref.current = value;
  return value_ref;
};

export const useStateRef = <
  S extends number | string | boolean | object | undefined | null,
>(
  initialState: S | (() => S),
): [S, React.Dispatch<React.SetStateAction<S>>, React.RefObject<S>] => {
  const [value, setRef_] = useState<S>(initialState);
  const ref = useRef(value);
  const setRef = (action: React.SetStateAction<S>) => {
    setRef_((oldValue) => {
      const newValue = typeof action === "function" ? action(oldValue) : action;
      ref.current = newValue;
      return newValue;
    });
  };

  return [value, setRef, ref];
};
