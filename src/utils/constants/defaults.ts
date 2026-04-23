import type { IRhythm } from "../../model";
import type { ISound } from "../../model/sound";
import { TEMP_CLICK_SOUND_URL } from "./common";

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

export const DEFAULT_BPM = 80;
export const DEFAULT_VOLUME = 0.5;
