import { createContext } from "react";

import { Metronome } from "~/model";
import { loadStorageSafely } from "~/utils/helpers";
import {
  APP_MAIN_STATE_STORAGE_KEY,
  DEFAULT_MAIN_STATE,
  DEFAULT_VOLUME,
  VOLUME_STORAGE_KEY,
} from "~/utils/constants";

import type { AppMainState, WithStateHook } from "~/utils/types";

//================================================

export type AppContextState = WithStateHook<"state", AppMainState> &
  WithStateHook<"volume", number> &
  WithStateHook<"playing", boolean> & {
    metronome: Metronome;
  };

const initialMainState = loadStorageSafely<AppMainState>(
  APP_MAIN_STATE_STORAGE_KEY,
  DEFAULT_MAIN_STATE,
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
  metronome: new Metronome({
    bpm: initialMainState.tempo.bpm,
    setPlaying: () => undefined,
    beatDivision: initialMainState.tempo.beatDivision,
  }),
});
