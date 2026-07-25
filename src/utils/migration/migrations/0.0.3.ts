import {
  DEFAULT_SOUND,
  DEFAULT_SOUND_SETTINGS,
  DEFAULT_TIME_SIGNATURE,
} from "~/utils/constants";

import type { ISound, ITempo, TimeSignature } from "~/model";
import type { Migration } from "~/utils/migration";
import type { IMeasure_0_0_1 } from "./0.0.1";
import type { AppData, NoteDivision } from "~/utils/types";

//================================================

const OLD_VERSION = "0.0.3" as const;
const NEW_VERSION = "0.0.4" as const;

//================================================

export type AppMainState_0_0_3 = {
  version: typeof OLD_VERSION;
  measures: IMeasure_0_0_1[];
  tempo: ITempo;
  volume: number;
  data: AppData;
};

//================================================

export interface INote_0_0_4 {
  volume: number;
  sound: ISound;
  division: NoteDivision;
  tuplet?: number;
  dotted?: 0 | 1 | 2;
}

export interface IMeasure_0_0_4 {
  timeSignature: TimeSignature;
  notes: INote_0_0_4[];
}

export type AppMainState_0_0_4 = {
  version: typeof NEW_VERSION;
  measures: IMeasure_0_0_4[];
  tempo: ITempo;
  volume: number;
  data: AppData;
};

//================================================

export const DEFAULT_MEASURE_0_0_4: IMeasure_0_0_4 = {
  timeSignature: DEFAULT_TIME_SIGNATURE,
  notes: [
    {
      sound: DEFAULT_SOUND,
      volume: DEFAULT_SOUND_SETTINGS.firstBeat.volume,
      division: DEFAULT_TIME_SIGNATURE.division,
    },
    {
      sound: DEFAULT_SOUND,
      volume: DEFAULT_SOUND_SETTINGS.base.volume,
      division: DEFAULT_TIME_SIGNATURE.division,
    },
    {
      sound: DEFAULT_SOUND,
      volume: DEFAULT_SOUND_SETTINGS.base.volume,
      division: DEFAULT_TIME_SIGNATURE.division,
    },
    {
      sound: DEFAULT_SOUND,
      volume: DEFAULT_SOUND_SETTINGS.base.volume,
      division: DEFAULT_TIME_SIGNATURE.division,
    },
  ],
};

const migrate: Migration<AppMainState_0_0_3, AppMainState_0_0_4> = (
  oldData,
) => ({
  ...oldData,
  measures: [DEFAULT_MEASURE_0_0_4],
  version: NEW_VERSION,
});

migrate.oldVersion = OLD_VERSION;
migrate.newVersion = NEW_VERSION;

export default migrate;
