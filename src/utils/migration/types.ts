export type Version = string;

export interface Migration<
  OldData extends { version: OldVersion },
  NewData extends { version: NewVersion },
  OldVersion = Version,
  NewVersion = Version,
> {
  (oldData: OldData): NewData;
  oldVersion: OldVersion;
  newVersion: NewVersion;
}
