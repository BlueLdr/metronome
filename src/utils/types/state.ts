import type { IRhythm, ISound, ITempo } from "~/model";
import type { KeybindSettings } from "./keybinds";

//================================================

export type AppSettings = {
  volume: VolumeSettings;
  keybinds: KeybindSettings;
};

export type AppData = {
  settings: AppSettings;
};

export type AppMainState = {
  rhythm: IRhythm;
  tempo: ITempo;
  sound: ISound;
  data: AppData;
};

export type VolumeSettings = {
  firstBeatVolume: number;
  beatVolume: number;
  subdivisionVolume: number;
};
