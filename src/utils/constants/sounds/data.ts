import { default as instrumentSounds } from "./instrument-names.json";
import { default as basicSounds } from "./base-sounds.json";

import type { ISound } from "~/model";
import type { ArrayItem } from "~/utils/types";

//================================================

export type SoundPreset =
  | ArrayItem<typeof basicSounds>
  | ArrayItem<typeof instrumentSounds>;
export type SoundName = SoundPreset["name"];

export const SOUND_OPTION_DATA_MAP = [
  ...basicSounds,
  ...instrumentSounds,
].reduce(
  (obj, sound) => ({
    ...obj,
    [sound.name]: sound,
  }),
  {} as {
    [K in SoundName]: ISound<K>;
  } & Record<string, ISound>,
);

export const BASIC_SOUND_OPTIONS = basicSounds.map(
  ({ attribution, ...sound }) => sound,
);
export const MIDI_SOUND_OPTIONS = instrumentSounds;

export const SOUND_OPTIONS = basicSounds;

export const BASIC_SOUND_NAMES = basicSounds.map((s) => s.name);
export const MIDI_SOUND_NAMES = instrumentSounds.map((s) => s.name);
