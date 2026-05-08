import { useCallback, useMemo, useState } from "react";

import { Metronome, Rhythm } from "~/model";
import {
  APP_MAIN_STATE_STORAGE_KEY,
  BPM_CHANGE_THROTTLE_INTERVAL,
  DEFAULT_BEAT_DIVISION,
  DEFAULT_BPM,
  DEFAULT_MAIN_STATE,
  DEFAULT_RHYTHM,
  DEFAULT_VOLUME,
  VOLUME_CHANGE_THROTTLE_INTERVAL,
} from "~/utils/constants";
import { useStorageReducer, useThrottledUpdate } from "~/utils/hooks";
import { appMainStateReducer } from "~/view/context/app/reducer";

import { AppContext } from "./context";

import type { TimeSignature, IRhythm } from "~/model";
import type { AppContextState } from "./context";

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
    (value: IRhythm) =>
      metronome.setRhythm(new Rhythm(value.timeSignature, value.notes)),
    BPM_CHANGE_THROTTLE_INTERVAL,
    [metronome],
    state.rhythm ?? DEFAULT_RHYTHM,
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
    }),
    [
      state,
      playing,
      metronome,
      setBpm,
      setTimeSignature,
      setSubdivisions,
      setVolume,
    ],
  );

  return <AppContext value={value}>{children}</AppContext>;
}
