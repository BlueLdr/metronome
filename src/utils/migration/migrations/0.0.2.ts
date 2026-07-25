import type { IMeasure, ITempo } from "~/model";
import type { Migration } from "~/utils/migration";
import type { AppData } from "~/utils/types";

//================================================

const OLD_VERSION = "0.0.2" as const;
const NEW_VERSION = "0.0.3" as const;

//================================================

export type AppMainState_0_0_2 = {
  version: typeof OLD_VERSION;
  rhythm: IMeasure;
  measures?: never;
  tempo: ITempo;
  volume: number;
  data: AppData;
};

//================================================

export type AppMainState_0_0_3 = {
  version: typeof NEW_VERSION;
  measures: IMeasure[];
  rhythm?: never;
  tempo: ITempo;
  volume: number;
  data: AppData;
};

//================================================

const migrate: Migration<AppMainState_0_0_2, AppMainState_0_0_3> = ({
  rhythm,
  ...oldData
}) => ({
  ...oldData,
  measures: [rhythm],
  version: NEW_VERSION,
});

migrate.oldVersion = OLD_VERSION;
migrate.newVersion = NEW_VERSION;

export default migrate;
