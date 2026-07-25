import type { AnyMigration, AnyAppMainStateVersion } from "./migrations";
import type { Version } from "./types";

//================================================

export const versionComparator = <T extends Version>(a: T, b: T) => {
  const [aMajor, aMinor, aPatch = 0] = a.split(".");
  const [bMajor, bMinor, bPatch = 0] = b.split(".");

  const result =
    Number(aMajor) - Number(bMajor) ||
    Number(aMinor) - Number(bMinor) ||
    Number(aPatch) - Number(bPatch);
  return isNaN(result) ? 0 : result;
};

export const migrationIsForDataVersion = <OldVersion extends Version>(
  data: AnyAppMainStateVersion,
  migration: AnyMigration & { oldVersion: OldVersion },
): data is Parameters<typeof migration>[0] =>
  data.version === migration.oldVersion;
