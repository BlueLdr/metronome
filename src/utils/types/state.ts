import type { IRhythm, ISound, ITempo } from "~/model";
import type { KeybindSettings } from "./keybinds";

//================================================

export type AppSettings = {
  sounds: SoundSettings;
  keybinds: KeybindSettings;
};

export type AppData = {
  settings: AppSettings;
};

export type AppMainState = {
  rhythm: IRhythm;
  tempo: ITempo;
  volume: number;
  data: AppData;
};

export type SoundSettings = {
  base: Required<SoundSettingsItem>;
  firstBeat: SoundSettingsItem;
  subdivision: SoundSettingsItem;
};

export type SoundSettingsItem = {
  sound?: ISound;
  volume: number;
};
