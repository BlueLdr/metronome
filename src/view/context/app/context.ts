import { createContext, useContext } from "react";

import { Metronome } from "~/model";
import { loadStorageSafely } from "~/utils/helpers";
import {
  APP_MAIN_STATE_STORAGE_KEY,
  DEFAULT_MAIN_STATE,
} from "~/utils/constants";

import type { TimeSignature } from "~/model";
import type {
  AppMainState,
  MetronomePreset,
  SoundSettings,
} from "~/utils/types";
import type { AppStateSetSoundAction } from "./reducer";

//================================================

export type AppContextState = {
  metronome: Metronome;
  playing: boolean;
  state: AppMainState;

  setBpm: React.Dispatch<React.SetStateAction<number>>;
  setTimeSignature: React.Dispatch<React.SetStateAction<TimeSignature>>;
  setSubdivisions: React.Dispatch<React.SetStateAction<number>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setSound: (parameters: AppStateSetSoundAction) => void;
  setSoundVolume: (
    part: keyof SoundSettings,
    newValue: React.SetStateAction<number>,
  ) => void;
  setSoundSettings: React.Dispatch<React.SetStateAction<SoundSettings>>;

  savePreset: (
    preset: MetronomePreset,
    replaceId?: MetronomePreset["id"],
  ) => void;
  deletePreset: (id: MetronomePreset["id"]) => void;
  loadPreset: (preset: MetronomePreset) => void;

  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  setSound: () => undefined,
  setSoundVolume: () => undefined,
  setSoundSettings: () => undefined,

  savePreset: () => undefined,
  deletePreset: () => undefined,
  loadPreset: () => undefined,

  setSidebarOpen: () => undefined,
});

export const useAppState = () => useContext(AppContext);
export const useMetronome = () => useContext(AppContext).metronome;
