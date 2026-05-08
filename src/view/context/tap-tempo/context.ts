import { createContext, useContext } from "react";

import type { WithStateHook } from "~/utils/types";

//================================================

export type TapTempoState = WithStateHook<"button", HTMLButtonElement | null>;

export const TapTempoContext = createContext<TapTempoState>({
  button: null,
  setButton: () => undefined,
});

export const useTapTempoContext = () => useContext(TapTempoContext);
