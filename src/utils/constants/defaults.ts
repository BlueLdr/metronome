import { KeybindAction } from "~/utils/types";

import { TEMP_CLICK_SOUND_URL } from "./common";

import type {
  AppData,
  AppMainState,
  AppSettings,
  KeybindSettings,
  VolumeSettings,
} from "~/utils/types";
import type { IRhythm, ISound, ITempo } from "~/model";

//================================================

export const DEFAULT_SOUND: ISound = {
  name: "click",
  url: TEMP_CLICK_SOUND_URL,
};

export const DEFAULT_RHYTHM: IRhythm = {
  timeSignature: { count: 4, division: 4 },
  notes: [
    { sound: DEFAULT_SOUND, volume: 1, interval: 0.25 },
    { sound: DEFAULT_SOUND, volume: 0.25, interval: 0.25 },
    { sound: DEFAULT_SOUND, volume: 0.25, interval: 0.25 },
    { sound: DEFAULT_SOUND, volume: 0.25, interval: 0.25 },
  ],
};

export const DEFAULT_VOLUME_SETTINGS: VolumeSettings = {
  firstBeatVolume: 1,
  beatVolume: 0.25,
  subdivisionVolume: 0.125,
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
  volume: DEFAULT_VOLUME_SETTINGS,
  keybinds: DEFAULT_KEYBINDS,
};

export const DEFAULT_DATA: AppData = {
  settings: DEFAULT_SETTINGS,
};

export const DEFAULT_BPM = 80;
export const DEFAULT_BEAT_DIVISION = 4;
export const DEFAULT_TEMPO: ITempo = {
  bpm: DEFAULT_BPM,
  beatDivision: DEFAULT_BEAT_DIVISION,
};

export const DEFAULT_VOLUME = 0.5;
export const DEFAULT_TAP_TEMPO_SAMPLE_SIZE = 6;

export const DEFAULT_MAIN_STATE: AppMainState = {
  rhythm: DEFAULT_RHYTHM,
  tempo: DEFAULT_TEMPO,
  sound: DEFAULT_SOUND,
  volume: DEFAULT_VOLUME,
  data: DEFAULT_DATA,
};
