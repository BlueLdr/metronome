import { createContext, useContext } from "react";

import { loadStorageSafely } from "~/utils/helpers";
import {
  APP_MAIN_STATE_STORAGE_KEY,
  DEFAULT_BPM,
  DEFAULT_RHYTHM,
  DEFAULT_VOLUME,
  VOLUME_STORAGE_KEY,
} from "~/utils/constants";

import type { AppMainState, WithStateHook } from "~/utils/types";

//================================================

export type AppContextState = WithStateHook<"state", AppMainState> &
  WithStateHook<"volume", number> &
  WithStateHook<"playing", boolean>;

const initialMainState = loadStorageSafely<AppMainState>(
  APP_MAIN_STATE_STORAGE_KEY,
  { bpm: DEFAULT_BPM, rhythm: DEFAULT_RHYTHM },
);
const initialVolume = loadStorageSafely<number>(
  VOLUME_STORAGE_KEY,
  DEFAULT_VOLUME,
);

export const AppContext = createContext<AppContextState>({
  state: initialMainState,
  setState: () => undefined,
  volume: initialVolume,
  setVolume: () => undefined,
  playing: false,
  setPlaying: () => undefined,
});

export const useAppState = () => useContext(AppContext);
