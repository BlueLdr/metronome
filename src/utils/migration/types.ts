export type Version = string;

export interface Migration<
  OldData extends { version: Version },
  NewData extends { version: Version },
> {
  (oldData: OldData): NewData;
  oldVersion: OldData extends { version: infer OldVersion extends string }
    ? OldVersion
    : never;
  newVersion: NewData extends { version: infer NewVersion extends string }
    ? NewVersion
    : never;
}
