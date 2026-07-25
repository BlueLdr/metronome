import migrate_0_0_1 from "./0.0.1";
import migrate_0_0_2 from "./0.0.2";
import migrate_0_0_3 from "./0.0.3";

import type { AppMainState_0_0_1, AppMainState_0_0_2 } from "./0.0.1";
import type { AppMainState_0_0_3 } from "./0.0.2";
import type { AppMainState_0_0_4 } from "./0.0.3";

//================================================

export type AnyAppMainStateVersion =
  | AppMainState_0_0_1
  | AppMainState_0_0_2
  | AppMainState_0_0_3
  | AppMainState_0_0_4;

const allMigrations = [migrate_0_0_1, migrate_0_0_2, migrate_0_0_3] as const;

export type AnyMigration =
  typeof allMigrations extends ReadonlyArray<infer T> ? T : never;

export default allMigrations;
