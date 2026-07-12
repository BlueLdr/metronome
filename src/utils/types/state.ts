import type { IRhythm, ISound, ITempo, TimeSignature } from "~/model";
import type { Version } from "../migration/types";
import type { KeybindSettings } from "./keybinds";

//================================================

export type AppSettings = {
  sounds: SoundSettings;
  keybinds: KeybindSettings;
};

export type AppMiscState = {
  sidebarOpen: boolean;
};

export type MetronomePreset = {
  id: string;
  name: string;
  timeSignature: TimeSignature;
  tempo: ITempo;
  subdivisionCount: number;
};

export type AppData = {
  settings: AppSettings;
  presets: MetronomePreset[];
  state: AppMiscState;
};

export type AppMainState = {
  version: Version;
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
