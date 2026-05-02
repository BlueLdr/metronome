import { useMemo, useState } from "react";

import { type IRhythm, Metronome, Rhythm } from "~/model";
import {
  APP_MAIN_STATE_STORAGE_KEY,
  BPM_CHANGE_THROTTLE_INTERVAL,
  DEFAULT_BEAT_DIVISION,
  DEFAULT_BPM,
  DEFAULT_RHYTHM,
  DEFAULT_VOLUME,
  DEFAULT_VOLUME_SETTINGS,
  VOLUME_CHANGE_THROTTLE_INTERVAL,
  VOLUME_STORAGE_KEY,
} from "~/utils/constants";
import { useStorageState, useThrottledUpdate } from "~/utils/hooks";

import { AppContext } from "./context";

import type { AppMainState } from "~/utils/types";
import type { AppContextState } from "./context";

//================================================

export function AppContextProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useStorageState<AppMainState>(
    APP_MAIN_STATE_STORAGE_KEY,
    {
      bpm: DEFAULT_BPM,
      rhythm: DEFAULT_RHYTHM,
      beatDivision: DEFAULT_BEAT_DIVISION,
      volumeSettings: DEFAULT_VOLUME_SETTINGS,
    },
  );

  const [volume, setVolume] = useStorageState<number>(
    VOLUME_STORAGE_KEY,
    DEFAULT_VOLUME,
  );

  const [playing, setPlaying] = useState(false);

  const metronome = useMemo(
    () =>
      new Metronome({
        beatDivision: state.beatDivision ?? DEFAULT_BEAT_DIVISION,
        bpm: state.bpm ?? DEFAULT_BPM,
        setPlaying,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useThrottledUpdate(
    (value: number) => metronome.setBpm(value),
    BPM_CHANGE_THROTTLE_INTERVAL,
    [metronome],
    state.bpm ?? DEFAULT_BPM,
  );

  useThrottledUpdate(
    (value: number) => metronome.setBeatDivision(value),
    BPM_CHANGE_THROTTLE_INTERVAL,
    [metronome],
    state.beatDivision ?? DEFAULT_BEAT_DIVISION,
  );

  useThrottledUpdate(
    (value: number) => metronome.setVolume(value),
    VOLUME_CHANGE_THROTTLE_INTERVAL,
    [metronome],
    volume ?? DEFAULT_VOLUME,
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
      setState,
      volume,
      setVolume,
      playing,
      setPlaying,
      metronome,
    }),
    [playing, setState, setVolume, state, volume, metronome],
  );

  return <AppContext value={value}>{children}</AppContext>;
}
