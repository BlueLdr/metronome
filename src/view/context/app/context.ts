import { createContext } from "react";

import { Metronome } from "~/model";
import { loadStorageSafely } from "~/utils/helpers";
import {
  APP_MAIN_STATE_STORAGE_KEY,
  DEFAULT_BEAT_DIVISION,
  DEFAULT_BPM,
  DEFAULT_RHYTHM,
  DEFAULT_VOLUME,
  DEFAULT_VOLUME_SETTINGS,
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
  {
    bpm: DEFAULT_BPM,
    rhythm: DEFAULT_RHYTHM,
    beatDivision: DEFAULT_BEAT_DIVISION,
    volumeSettings: DEFAULT_VOLUME_SETTINGS,
  },
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
    bpm: initialMainState.bpm,
    setPlaying: () => undefined,
    beatDivision: initialMainState.beatDivision,
  }),
});
