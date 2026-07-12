import migrate_0_0_1 from "./0.0.1";

import type { AppMainState_0_0_1, AppMainState_0_0_2 } from "./0.0.1";

//================================================

export type AnyAppMainStateVersion = AppMainState_0_0_1 | AppMainState_0_0_2;

export default [migrate_0_0_1];
