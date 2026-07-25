import set from "lodash/fp/set";

import { Sound } from "~/model";
import { MAX_BPM, MIN_BPM } from "~/utils/constants";
import { createMeasure } from "~/utils/helpers";

import type { TimeSignature } from "~/model";
import type {
  AppMainState,
  MetronomePreset,
  SoundSettings,
} from "~/utils/types";

//================================================

export type AppStateSetSoundAction = {
  [K in keyof SoundSettings]: {
    part: K;
    value: SoundSettings[K]["sound"];
  };
}[keyof SoundSettings];

export type AppStateActionMap = {
  ["set-bpm"]: { value: React.SetStateAction<number> };
  ["set-time-signature"]: { value: React.SetStateAction<TimeSignature> };
  ["set-subdivisions"]: { value: React.SetStateAction<number> };
  ["set-volume"]: { value: React.SetStateAction<number> };
  ["set-sound"]: AppStateSetSoundAction;
  ["set-sound-volume"]: {
    value: React.SetStateAction<number>;
    part: keyof SoundSettings;
  };
  ["set-sound-settings"]: { value: React.SetStateAction<SoundSettings> };
  ["save-preset"]: {
    value: MetronomePreset;
    replaceId?: MetronomePreset["id"];
  };
  ["delete-preset"]: { value: MetronomePreset["id"] };
  ["load-preset"]: { value: MetronomePreset };
  ["set-sidebar-open"]: { value: React.SetStateAction<boolean> };
};

export type AppMainStateReducerAction = {
  [K in keyof AppStateActionMap]: {
    type: K;
    parameters: AppStateActionMap[K];
  };
}[keyof AppStateActionMap];

const checkOptionsExhausted = (action: never) => action;

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
        measures: state.measures.map((m) =>
          createMeasure(
            resolveNewState(action.parameters.value, m.timeSignature),
            state.data.settings.sounds,
            Math.round(m.notes.length / m.timeSignature.count),
          ),
        ),
      };

    case "set-subdivisions":
      return {
        ...state,
        measures: state.measures.map((m) =>
          createMeasure(
            m.timeSignature,
            state.data.settings.sounds,
            Math.round(
              resolveNewState(
                action.parameters.value,
                Math.round(m.notes.length / m.timeSignature.count),
              ),
            ),
          ),
        ),
      };

    case "set-volume":
      return {
        ...state,
        volume: Sound.clampVolume(
          resolveNewState(action.parameters.value, state.volume),
        ),
      };

    case "set-sound": {
      const newState = set(
        ["data", "settings", "sounds", action.parameters.part, "sound"],
        resolveNewState(
          action.parameters.value,
          state.data.settings.sounds[action.parameters.part].sound,
        ),
        state,
      );
      return {
        ...newState,
        measures: state.measures.map((m) =>
          createMeasure(
            m.timeSignature,
            newState.data.settings.sounds,
            Math.round(m.notes.length / m.timeSignature.count),
          ),
        ),
      };
    }

    case "set-sound-volume": {
      const newState = set(
        ["data", "settings", "sounds", action.parameters.part, "volume"],
        resolveNewState(
          action.parameters.value,
          state.data.settings.sounds[action.parameters.part].volume,
        ),
        state,
      );
      return {
        ...newState,
        measures: state.measures.map((m) =>
          createMeasure(
            m.timeSignature,
            newState.data.settings.sounds,
            Math.round(m.notes.length / m.timeSignature.count),
          ),
        ),
      };
    }

    case "set-sound-settings": {
      const newState = set(
        ["data", "settings", "sounds"],
        resolveNewState(action.parameters.value, state.data.settings.sounds),
        state,
      );

      return {
        ...newState,
        measures: state.measures.map((m) =>
          createMeasure(
            m.timeSignature,
            newState.data.settings.sounds,
            Math.round(m.notes.length / m.timeSignature.count),
          ),
        ),
      };
    }

    case "save-preset": {
      const { value, replaceId } = action.parameters;
      const updatedPresets = state.data.presets;
      const index = updatedPresets.findIndex(
        (p) => p.id === (replaceId ?? value.id),
      );
      if (index > -1) {
        updatedPresets[index] = value;
      } else {
        updatedPresets.push(value);
      }

      return set(["data", "presets"], updatedPresets, state);
    }

    case "delete-preset": {
      return set(
        ["data", "presets"],
        state.data.presets.filter((p) => p.id !== action.parameters.value),
        state,
      );
    }

    case "load-preset": {
      const preset = action.parameters.value;
      const measure = createMeasure(
        preset.timeSignature,
        state.data.settings.sounds,
        preset.subdivisionCount,
      );
      return {
        ...state,
        measures: [measure],
        tempo: preset.tempo,
      };
    }

    case "set-sidebar-open": {
      return set(
        ["data", "state", "sidebarOpen"],
        resolveNewState(action.parameters.value, state.data.state.sidebarOpen),
        state,
      );
    }

    default:
      checkOptionsExhausted(action);
      return state;
  }
}
