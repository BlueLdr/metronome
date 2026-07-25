import { KeybindAction } from "~/utils/types";

import { SOUND_OPTIONS } from "./sounds";

import type {
  AppMiscState,
  AppData,
  AppMainState,
  AppSettings,
  KeybindSettings,
  SoundSettings,
} from "~/utils/types";
import type { IMeasure, ISound, ITempo, TimeSignature } from "~/model";

//================================================

export const DEFAULT_SOUND: ISound = SOUND_OPTIONS[0];

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  base: { sound: DEFAULT_SOUND, volume: 0.4 },
  firstBeat: { volume: 1 },
  subdivision: { volume: 0.15 },
};

export const DEFAULT_KEYBINDS: KeybindSettings = {
  [KeybindAction.PlayPause]: [
    {
      key: " ",
    },
  ],
  [KeybindAction.BpmUp]: [
    {
      key: "ArrowRight",
    },
  ],
  [KeybindAction.BpmDown]: [
    {
      key: "ArrowLeft",
    },
  ],
  [KeybindAction.BpmJumpUp]: [
    {
      key: "ArrowRight",
      shiftKey: true,
    },
  ],
  [KeybindAction.BpmJumpDown]: [
    {
      key: "ArrowLeft",
      shiftKey: true,
    },
  ],
  [KeybindAction.VolumeUp]: [
    {
      key: "ArrowUp",
    },
  ],
  [KeybindAction.VolumeDown]: [
    {
      key: "ArrowDown",
    },
  ],
  [KeybindAction.VolumeJumpUp]: [
    {
      key: "ArrowUp",
      shiftKey: true,
    },
  ],
  [KeybindAction.VolumeJumpDown]: [
    {
      key: "ArrowDown",
      shiftKey: true,
    },
  ],
  [KeybindAction.TapTempo]: [
    {
      key: "t",
    },
  ],
};

export const DEFAULT_SETTINGS: AppSettings = {
  sounds: DEFAULT_SOUND_SETTINGS,
  keybinds: DEFAULT_KEYBINDS,
};

export const DEFAULT_MISC_STATE: AppMiscState = {
  sidebarOpen: true,
};

export const DEFAULT_DATA: AppData = {
  settings: DEFAULT_SETTINGS,
  state: DEFAULT_MISC_STATE,
  presets: [],
};

export const DEFAULT_BPM = 80;
export const DEFAULT_BEAT_DIVISION = 4;
export const DEFAULT_TEMPO: ITempo = {
  bpm: DEFAULT_BPM,
  beatDivision: DEFAULT_BEAT_DIVISION,
};

export const DEFAULT_VOLUME = 0.5;
export const DEFAULT_TAP_TEMPO_SAMPLE_SIZE = 6;

export const DEFAULT_TIME_SIGNATURE: TimeSignature = { count: 4, division: 4 };
export const DEFAULT_MEASURE: IMeasure = {
  timeSignature: DEFAULT_TIME_SIGNATURE,
  notes: [
    {
      sound: DEFAULT_SOUND,
      volume: DEFAULT_SOUND_SETTINGS.firstBeat.volume,
      interval: 1 / DEFAULT_TIME_SIGNATURE.division,
    },
    {
      sound: DEFAULT_SOUND,
      volume: DEFAULT_SOUND_SETTINGS.base.volume,
      interval: 1 / DEFAULT_TIME_SIGNATURE.division,
    },
    {
      sound: DEFAULT_SOUND,
      volume: DEFAULT_SOUND_SETTINGS.base.volume,
      interval: 1 / DEFAULT_TIME_SIGNATURE.division,
    },
    {
      sound: DEFAULT_SOUND,
      volume: DEFAULT_SOUND_SETTINGS.base.volume,
      interval: 1 / DEFAULT_TIME_SIGNATURE.division,
    },
  ],
};

export const DEFAULT_MAIN_STATE: AppMainState = {
  version: import.meta.env.VITE_APP_VERSION,
  measures: [DEFAULT_MEASURE],
  tempo: DEFAULT_TEMPO,
  volume: DEFAULT_VOLUME,
  data: DEFAULT_DATA,
};
