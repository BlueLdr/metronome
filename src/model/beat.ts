import type { INote } from "./note";

//================================================

export interface IBeat {
  noteIndex: number;
  beatIndex: number;
  totalInterval: number;
  notes: INote[];
}
