import { type PropsWithChildren, useMemo, useState } from "react";
import type { AppMainState } from "../../../utils/types";
import {
  APP_MAIN_STATE_STORAGE_KEY,
  DEFAULT_BPM,
  DEFAULT_RHYTHM,
  DEFAULT_VOLUME,
  VOLUME_STORAGE_KEY,
} from "../../../utils/constants";
import { useStorageState } from "../../../utils/hooks";
import { AppContext, type AppContextState } from "./context.ts";

//================================================

export type AppContextProviderProps = PropsWithChildren;

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [state, setState] = useStorageState<AppMainState>(
    APP_MAIN_STATE_STORAGE_KEY,
    { bpm: DEFAULT_BPM, rhythm: DEFAULT_RHYTHM },
  );

  const [volume, setVolume] = useStorageState(
    VOLUME_STORAGE_KEY,
    DEFAULT_VOLUME,
  );

  const [playing, setPlaying] = useState(false);

  const value = useMemo<AppContextState>(
    () => ({
      state,
      setState,
      volume,
      setVolume,
      playing,
      setPlaying,
    }),
    [playing, setState, setVolume, state, volume],
  );

  return <AppContext value={value}>{children}</AppContext>;
}
