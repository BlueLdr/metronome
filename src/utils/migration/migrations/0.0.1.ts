import { DEFAULT_MISC_STATE } from "~/utils/constants";

import type { IRhythm, ITempo } from "~/model";
import type { Migration } from "~/utils/migration";
import type { AppSettings } from "~/utils/types";

//================================================

const OLD_VERSION = "0.0.1" as const;
const NEW_VERSION = "0.0.2" as const;

//================================================

type AppData_0_0_1 = {
  settings: AppSettings;
};

export type AppMainState_0_0_1 = {
  version: typeof OLD_VERSION;
  rhythm: IRhythm;
  tempo: ITempo;
  volume: number;
  data: AppData_0_0_1;
};

//================================================

type MetronomePreset = {
  id: string;
  name: string;
  rhythm: IRhythm;
  tempo: ITempo;
};

type AppMiscState_0_0_2 = {
  sidebarOpen: boolean;
};

type AppData_0_0_2 = {
  settings: AppSettings;
  presets: MetronomePreset[];
  state: AppMiscState_0_0_2;
};

export type AppMainState_0_0_2 = {
  version: typeof NEW_VERSION;
  rhythm: IRhythm;
  tempo: ITempo;
  volume: number;
  data: AppData_0_0_2;
};

//================================================

const migrate: Migration<AppMainState_0_0_1, AppMainState_0_0_2> = (
  oldData,
) => ({
  ...oldData,
  data: {
    ...oldData.data,
    state: DEFAULT_MISC_STATE,
    presets: [],
  },
  version: NEW_VERSION,
});

migrate.oldVersion = OLD_VERSION;
migrate.newVersion = NEW_VERSION;

export default migrate;
