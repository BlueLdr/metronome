import set from "lodash/fp/set";

import { Sound } from "~/model";
import { MAX_BPM, MIN_BPM } from "~/utils/constants";
import { createRhythm } from "~/utils/helpers";

import type { TimeSignature } from "~/model";
import type { AppMainState } from "~/utils/types";

//================================================

export type AppStateActionMap = {
  ["set-bpm"]: { value: React.SetStateAction<number> };
  ["set-time-signature"]: { value: React.SetStateAction<TimeSignature> };
  ["set-subdivisions"]: { value: React.SetStateAction<number> };
  ["set-volume"]: { value: React.SetStateAction<number> };
};

export type AppMainStateReducerAction = {
  [K in keyof AppStateActionMap]: {
    type: K;
    parameters: AppStateActionMap[K];
  };
}[keyof AppStateActionMap];

const resolveNewState = <
  T extends string | number | boolean | object | null | undefined,
>(
  action: React.SetStateAction<T>,
  prevValue: T,
): T => (typeof action === "function" ? action(prevValue) : action);

export function appMainStateReducer(
  state: AppMainState,
  action: AppMainStateReducerAction,
): AppMainState {
  switch (action.type) {
    case "set-bpm": {
      const newValue = action.parameters.value;
      return set(
        ["tempo", "bpm"],
        Math.min(
          MAX_BPM,
          Math.max(MIN_BPM, resolveNewState(newValue, state.tempo.bpm)),
        ),
        state,
      );
    }

    case "set-time-signature":
      return {
        ...state,
        rhythm: createRhythm(
          resolveNewState(action.parameters.value, state.rhythm.timeSignature),
          Math.round(
            state.rhythm.notes.length / state.rhythm.timeSignature.count,
          ),
          state.data.settings.volume,
        ),
      };

    case "set-subdivisions":
      return {
        ...state,
        rhythm: createRhythm(
          state.rhythm.timeSignature,
          Math.round(
            resolveNewState(
              action.parameters.value,
              Math.round(
                state.rhythm.notes.length / state.rhythm.timeSignature.count,
              ),
            ),
          ),
          state.data.settings.volume,
        ),
      };

    case "set-volume":
      return {
        ...state,
        volume: Sound.clampVolume(
          resolveNewState(action.parameters.value, state.volume),
        ),
      };

    default:
      return state;
  }
}
