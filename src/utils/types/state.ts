import type { IRhythm } from "~/model";

//================================================

export type AppMainState = {
  rhythm: IRhythm;
  bpm: number;
  beatDivision: number;
  volumeSettings: VolumeSettings;
};

export type VolumeSettings = {
  firstBeatVolume: number;
  beatVolume: number;
  subdivisionVolume: number;
};
