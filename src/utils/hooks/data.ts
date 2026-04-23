import { useRef } from "react";

//================================================

export const useValueRef = <T>(value: T) => {
  const value_ref = useRef<T>(value);
  // eslint-disable-next-line react-hooks/refs
  value_ref.current = value;
  return value_ref;
};
