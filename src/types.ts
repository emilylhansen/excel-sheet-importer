import { State } from "./reducer";
import * as O from "fp-ts/lib/Option";

export type ColumnId = string;

export type ColumnIndex = number;

export type ColumnItem = {
  id: string;
  value: string;
};

export type BlobId = string;

export type Blob = {
  filename: string;
  data: Record<ColumnId, Array<ColumnItem>>;
};

export type RootState = { root: State };

export type ColumnIdsForFields = {
  columnIdForParameter: ColumnId;
  columnIdForColumn: O.Option<ColumnId>;
};
