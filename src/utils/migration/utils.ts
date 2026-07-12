import type { AnyAppMainStateVersion } from "~/utils/migration/migrations";
import type { Migration, Version } from "./types";

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

export const migrationIsForDataVersion = <
  OldData extends AnyAppMainStateVersion & { version: OldVersion },
  NewData extends AnyAppMainStateVersion & { version: NewVersion },
  OldVersion = Version,
  NewVersion = Version,
>(
  data: AnyAppMainStateVersion,
  migration: Migration<OldData, NewData, OldVersion, NewVersion>,
): data is Parameters<typeof migration>[0] =>
  data.version === migration.oldVersion;
