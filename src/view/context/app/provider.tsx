import { useCallback, useMemo, useState } from "react";

import { Metronome, Measure } from "~/model";
import {
  APP_MAIN_STATE_STORAGE_KEY,
  BPM_CHANGE_THROTTLE_INTERVAL,
  DEFAULT_BEAT_DIVISION,
  DEFAULT_BPM,
  DEFAULT_MAIN_STATE,
  DEFAULT_MEASURE,
  DEFAULT_VOLUME,
  VOLUME_CHANGE_THROTTLE_INTERVAL,
} from "~/utils/constants";
import { useStorageReducer, useThrottledUpdate } from "~/utils/hooks";

import { AppContext } from "./context";
import { appMainStateReducer } from "./reducer";

import type { MetronomePreset, SoundSettings } from "~/utils/types";
import type { TimeSignature, IMeasure } from "~/model";
import type { AppContextState } from "./context";
import type { AppStateSetSoundAction } from "./reducer";

//================================================

export function AppContextProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = useStorageReducer(
    APP_MAIN_STATE_STORAGE_KEY,
    DEFAULT_MAIN_STATE,
    appMainStateReducer,
  );

  const setBpm = useCallback(
    (value: React.SetStateAction<number>) =>
      dispatch({ type: "set-bpm", parameters: { value } }),
    [dispatch],
  );
  const setTimeSignature = useCallback(
    (value: React.SetStateAction<TimeSignature>) =>
      dispatch({ type: "set-time-signature", parameters: { value } }),
    [dispatch],
  );
  const setSubdivisions = useCallback(
    (value: React.SetStateAction<number>) =>
      dispatch({ type: "set-subdivisions", parameters: { value } }),
    [dispatch],
  );

  const setVolume = useCallback(
    (value: React.SetStateAction<number>) =>
      dispatch({ type: "set-volume", parameters: { value } }),
    [dispatch],
  );

  const setSound = useCallback(
    (parameters: AppStateSetSoundAction) =>
      dispatch({ type: "set-sound", parameters }),
    [dispatch],
  );

  const setSoundVolume = useCallback(
    (part: keyof SoundSettings, value: React.SetStateAction<number>) =>
      dispatch({ type: "set-sound-volume", parameters: { part, value } }),
    [dispatch],
  );

  const setSoundSettings = useCallback(
    (value: React.SetStateAction<SoundSettings>) =>
      dispatch({ type: "set-sound-settings", parameters: { value } }),
    [dispatch],
  );

  const savePreset = useCallback(
    (value: MetronomePreset, replaceId?: MetronomePreset["id"]) =>
      dispatch({ type: "save-preset", parameters: { value, replaceId } }),
    [dispatch],
  );

  const deletePreset = useCallback(
    (value: MetronomePreset["id"]) =>
      dispatch({ type: "delete-preset", parameters: { value } }),
    [dispatch],
  );

  const loadPreset = useCallback(
    (value: MetronomePreset) =>
      dispatch({ type: "load-preset", parameters: { value } }),
    [dispatch],
  );

  const setSidebarOpen = useCallback(
    (value: React.SetStateAction<boolean>) =>
      dispatch({ type: "set-sidebar-open", parameters: { value } }),
    [dispatch],
  );

  const [playing, setPlaying] = useState(false);

  const metronome = useMemo(
    () =>
      new Metronome({
        ...state.tempo,
        setPlaying,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useThrottledUpdate(
    (value: number) => metronome.setBpm(value),
    BPM_CHANGE_THROTTLE_INTERVAL,
    [metronome],
    state.tempo.bpm ?? DEFAULT_BPM,
  );

  useThrottledUpdate(
    (value: number) => metronome.setBeatDivision(value),
    BPM_CHANGE_THROTTLE_INTERVAL,
    [metronome],
    state.tempo.beatDivision ?? DEFAULT_BEAT_DIVISION,
  );

  useThrottledUpdate(
    (value: number) => metronome.setVolume(value),
    VOLUME_CHANGE_THROTTLE_INTERVAL,
    [metronome],
    state.volume ?? DEFAULT_VOLUME,
  );

  useThrottledUpdate(
    (value: IMeasure[]) =>
      metronome.setMeasures(
        value.map((m) => new Measure(m.timeSignature, m.notes)),
      ),
    BPM_CHANGE_THROTTLE_INTERVAL,
    [metronome],
    state.measures ?? DEFAULT_MEASURE,
    JSON.stringify,
  );

  const value = useMemo<AppContextState>(
    () => ({
      state,
      playing,
      metronome,

      setBpm,
      setTimeSignature,
      setSubdivisions,
      setVolume,
      setSound,
      setSoundVolume,
      setSoundSettings,

      savePreset,
      deletePreset,
      loadPreset,

      setSidebarOpen,
    }),
    [
      state,
      playing,
      metronome,
      setBpm,
      setTimeSignature,
      setSubdivisions,
      setVolume,
      setSound,
      setSoundVolume,
      setSoundSettings,
      savePreset,
      deletePreset,
      loadPreset,
      setSidebarOpen,
    ],
  );

  return <AppContext value={value}>{children}</AppContext>;
}
