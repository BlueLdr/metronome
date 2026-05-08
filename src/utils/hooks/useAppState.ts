import { useCallback, useContext } from "react";

import { MAX_BPM, MIN_BPM } from "~/utils/constants";
import { createRhythm } from "~/utils/helpers";
import { AppContext } from "~/view/context";

import type { TimeSignature } from "~/model";

//================================================

export const useAppState = () => useContext(AppContext);
export const useMetronome = () => useContext(AppContext).metronome;

export const useAppBpmState = () => {
  const { state, setState } = useAppState();

  const setBpm = useCallback(
    (value: React.SetStateAction<number>) =>
      setState((s) => ({
        ...s,
        tempo: {
          ...s.tempo,
          bpm: Math.min(
            MAX_BPM,
            Math.max(
              MIN_BPM,
              typeof value === "number" ? value : value(s.tempo.bpm),
            ),
          ),
        },
      })),
    [setState],
  );

  return [state.tempo.bpm, setBpm, state] as const;
};

export const useAppTimeSignatureState = () => {
  const { state, setState } = useAppState();

  const setTimeSignature = (value: TimeSignature) =>
    setState((s) => ({
      ...s,
      rhythm: createRhythm(
        value,
        Math.round(
          state.rhythm.notes.length / state.rhythm.timeSignature.count,
        ),
        state.data.settings.volume,
      ),
    }));

  return [state.rhythm.timeSignature, setTimeSignature, state] as const;
};

export const useAppSubdivisonsState = () => {
  const { state, setState } = useAppState();

  const subdivisons =
    state.rhythm.notes.length / state.rhythm.timeSignature.count;

  const setSubdivisons = (newValue: number | null) => {
    if (newValue == null) {
      return;
    }

    setState((s) => ({
      ...s,
      rhythm: createRhythm(
        state.rhythm.timeSignature,
        Math.round(newValue),
        state.data.settings.volume,
      ),
    }));
  };

  return [subdivisons, setSubdivisons, state] as const;
};
