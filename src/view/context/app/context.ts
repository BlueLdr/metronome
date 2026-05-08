import { createContext, useContext } from "react";

import { Metronome } from "~/model";
import { loadStorageSafely } from "~/utils/helpers";
import {
  APP_MAIN_STATE_STORAGE_KEY,
  DEFAULT_MAIN_STATE,
} from "~/utils/constants";

import type { TimeSignature } from "~/model";
import type { AppMainState } from "~/utils/types";

//================================================

export type AppContextState = {
  metronome: Metronome;
  playing: boolean;
  state: AppMainState;

  setBpm: React.Dispatch<React.SetStateAction<number>>;
  setTimeSignature: React.Dispatch<React.SetStateAction<TimeSignature>>;
  setSubdivisions: React.Dispatch<React.SetStateAction<number>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
};

const initialMainState = loadStorageSafely<AppMainState>(
  APP_MAIN_STATE_STORAGE_KEY,
  DEFAULT_MAIN_STATE,
);

export const AppContext = createContext<AppContextState>({
  state: initialMainState,
  playing: false,
  metronome: new Metronome({
    bpm: initialMainState.tempo.bpm,
    setPlaying: () => undefined,
    beatDivision: initialMainState.tempo.beatDivision,
  }),
  setBpm: () => undefined,
  setTimeSignature: () => undefined,
  setSubdivisions: () => undefined,
  setVolume: () => undefined,
});

export const useAppState = () => useContext(AppContext);
export const useMetronome = () => useContext(AppContext).metronome;
