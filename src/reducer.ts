import produce from "immer";
import { Blob, ColumnIndex, ColumnIdsForFields, ColumnItem } from "./types";
import * as R from "fp-ts/lib/Record";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import {
  ReducerActions,
  LOAD_DATA,
  SELECT_COLUMN,
  INIT_GRID,
  SET_FIRST_DATA_POINT_ROW_NUMBER,
  SET_DATA_HEADER_ROW_RANGE,
  SET_NON_STATIC_DATA_CELL
} from "./actions";
import { parseDataHeaderRowRange } from "./helpers";

const INITIALIZER_COLUMN_INDEX = 0;

export type State = {
  blob: O.Option<Blob>;
  blobForServer: O.Option<Blob>;
  columnIdsByColumnIndex: Record<ColumnIndex, ColumnIdsForFields>;
  firstDataPointRowNumber: number;
  dataHeaderRowRange: string;
};

const INITAL_STATE: State = {
  blob: O.none,
  blobForServer: O.none,
  columnIdsByColumnIndex: R.empty,
  firstDataPointRowNumber: 2,
  dataHeaderRowRange: ""
};

export const rootReducer = produce(
  (draft: State, action: ReducerActions): State => {
    if (action.type === LOAD_DATA) {
      const { blob } = action.payload;

      return {
        ...draft,
        blob: O.some(blob),
        blobForServer: O.some(blob),
        columnIdsByColumnIndex: pipe(
          blob.data,
          R.keys,
          A.head,
          O.map((colId) => ({
            /** set the first/initializer column */
            [INITIALIZER_COLUMN_INDEX]: {
              columnIdForParameter: colId,
              columnIdForColumn: O.none
            }
          })),
          O.getOrElse<State["columnIdsByColumnIndex"]>(() => R.empty)
        )
      };
    }

    if (action.type === SELECT_COLUMN) {
      const {
        columnIdForParameter,
        columnIdForColumn,
        columnIndex
      } = action.payload;

      return {
        ...draft,
        columnIdsByColumnIndex: {
          ...draft.columnIdsByColumnIndex,
          [columnIndex]: {
            columnIdForParameter,
            columnIdForColumn
          }
        }
      };
    }

    if (action.type === INIT_GRID) {
      const { columnIdForParameter, columnIdForColumn } = action.payload;

      const newColumnIdsByColumnIndex: State["columnIdsByColumnIndex"] = pipe(
        draft.blob,
        O.map((b) => b.data),
        O.map(R.keys),
        /** initialize all other columns with a parameter */
        O.map((cols) =>
          cols.reduce(
            (acc, colId, idx) =>
              columnIdForParameter === colId
                ? {
                    ...acc,
                    [INITIALIZER_COLUMN_INDEX]: {
                      columnIdForParameter,
                      columnIdForColumn
                    }
                  }
                : {
                    ...acc,
                    [idx]: {
                      columnIdForParameter: colId,
                      columnIdForColumn: O.none
                    }
                  },
            R.empty
          )
        ),
        O.getOrElse(() => draft.columnIdsByColumnIndex)
      );

      return {
        ...draft,
        columnIdsByColumnIndex: newColumnIdsByColumnIndex
      };
    }

    if (action.type === SET_FIRST_DATA_POINT_ROW_NUMBER) {
      return {
        ...draft,
        firstDataPointRowNumber: action.payload.rowNumber
      };
    }

    if (action.type === SET_DATA_HEADER_ROW_RANGE) {
      const { rowRange } = action.payload;

      const parsedDataHeaderRowRange = parseDataHeaderRowRange(rowRange);

      const newFirstDataPointRowNumber =
        draft.firstDataPointRowNumber <= parsedDataHeaderRowRange
          ? parsedDataHeaderRowRange + 1
          : draft.firstDataPointRowNumber;

      return {
        ...draft,
        dataHeaderRowRange: rowRange,
        firstDataPointRowNumber: newFirstDataPointRowNumber
      };
    }

    if (action.type === SET_NON_STATIC_DATA_CELL) {
      const { columnIdForColumn, rowIndex, value } = action.payload;

      const newBlobForServer: State["blobForServer"] = pipe(
        draft.blobForServer,
        O.map((b) => {
          const makeNewColumnItems = (
            cItems: Array<ColumnItem>
          ): Array<ColumnItem> =>
            pipe(
              cItems,
              A.modifyAt<ColumnItem>(
                /** account for offset when first data point row number changes */
                rowIndex + draft.firstDataPointRowNumber - 1,
                (colItem: ColumnItem) => ({
                  ...colItem,
                  value
                })
              ),
              O.getOrElse(() => cItems)
            );

          const newData = pipe(
            R.modifyAt(columnIdForColumn, makeNewColumnItems)(b.data),
            O.getOrElse(() => b.data)
          );

          return { ...b, data: newData };
        })
      );
      console.log({ newBlobForServer, columnIdForColumn, rowIndex, value });
      return { ...draft, blobForServer: newBlobForServer };
    }

    return draft;
  },
  INITAL_STATE
);
