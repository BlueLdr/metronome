import {
  APP_MAIN_STATE_STORAGE_KEY,
  DEFAULT_MAIN_STATE,
} from "~/utils/constants";
import { loadStorageSafely } from "~/utils/helpers";

import allMigrations from "./migrations";
import { migrationIsForDataVersion, versionComparator } from "./utils";

import type { AnyAppMainStateVersion } from "./migrations";

const CODE_VERSION = import.meta.env.VITE_APP_VERSION;

//================================================

export default function runMigrations() {
  const storedData = loadStorageSafely<AnyAppMainStateVersion>(
    APP_MAIN_STATE_STORAGE_KEY,
    DEFAULT_MAIN_STATE as AnyAppMainStateVersion,
  );
  storedData.version = storedData.version ?? allMigrations[0].oldVersion;

  if (storedData.version === CODE_VERSION) {
    return;
  }

  try {
    console.log(
      `Stored data version (${storedData.version}) does not match code version (${CODE_VERSION}), need to run migrations.`,
    );

    let newData = storedData;

    allMigrations.forEach((migration) => {
      if (versionComparator(CODE_VERSION, migration.newVersion) < 0) {
        return;
      }
      if (migrationIsForDataVersion(newData, migration)) {
        console.log(
          `\tRunning migration: ${migration.oldVersion} => ${migration.newVersion}`,
        );
        newData = migration(newData as never);
      }
    });

    newData.version = CODE_VERSION;
    console.log(`Finished migrations`);
    window.localStorage.setItem(
      APP_MAIN_STATE_STORAGE_KEY,
      JSON.stringify(newData),
    );
  } catch (e) {
    console.error(`Failed to run migrations:`, e);
  }
}
