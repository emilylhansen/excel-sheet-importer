import { Action } from "redux";
import { Blob, ColumnId } from "./types";
import * as O from "fp-ts/lib/Option";

export const LOAD_DATA = "LOAD_DATA";
type LoadData = typeof LOAD_DATA;
type LoadDataAction = Action<LoadData> & { payload: { blob: Blob } };
export const loadData = (blob: Blob): LoadDataAction => ({
  type: LOAD_DATA,
  payload: { blob }
});

export const SET_FIRST_DATA_POINT_ROW_NUMBER =
  "SET_FIRST_DATA_POINT_ROW_NUMBER";
type SetFirstDataPointRowNumber = typeof SET_FIRST_DATA_POINT_ROW_NUMBER;
type SetFirstDataPointRowNumberAction = Action<SetFirstDataPointRowNumber> & {
  payload: { rowNumber: number };
};
export const setFirstDataPointRowNumber = (
  rowNumber: number
): SetFirstDataPointRowNumberAction => ({
  type: SET_FIRST_DATA_POINT_ROW_NUMBER,
  payload: { rowNumber }
});

export const SET_DATA_HEADER_ROW_RANGE = "SET_DATA_HEADER_ROW_RANGE";
type SetDataHeaderRowRange = typeof SET_DATA_HEADER_ROW_RANGE;
type SetDataHeaderRowRangeAction = Action<SetDataHeaderRowRange> & {
  payload: { rowRange: string };
};
export const setDataHeaderRowRange = (
  rowRange: string
): SetDataHeaderRowRangeAction => ({
  type: SET_DATA_HEADER_ROW_RANGE,
  payload: { rowRange }
});

export const SELECT_COLUMN = "SELECT_COLUMN";
type SelectColumn = typeof SELECT_COLUMN;
type SelectColumnAction = Action<SelectColumn> & {
  payload: {
    columnIdForParameter: ColumnId;
    columnIdForColumn: O.Option<ColumnId>;
    columnIndex: number;
  };
};
export const selectColumn = ({
  columnIdForParameter,
  columnIdForColumn,
  columnIndex
}: {
  columnIdForParameter: ColumnId;
  columnIdForColumn: O.Option<ColumnId>;
  columnIndex: number;
}): SelectColumnAction => ({
  type: SELECT_COLUMN,
  payload: { columnIdForParameter, columnIdForColumn, columnIndex }
});

export const INIT_GRID = "INIT_GRID";
type InitGrid = typeof INIT_GRID;
type InitGridAction = Action<InitGrid> & {
  payload: {
    columnIdForParameter: ColumnId;
    columnIdForColumn: O.Option<ColumnId>;
    columnIndex: number;
  };
};
export const initGrid = ({
  columnIdForParameter,
  columnIdForColumn,
  columnIndex
}: {
  columnIdForParameter: ColumnId;
  columnIdForColumn: O.Option<ColumnId>;
  columnIndex: number;
}): InitGridAction => ({
  type: INIT_GRID,
  payload: { columnIdForParameter, columnIdForColumn, columnIndex }
});

export const SET_NON_STATIC_DATA_CELL = "SET_NON_STATIC_DATA_CELL";
type SetNonStaticDataCell = typeof SET_NON_STATIC_DATA_CELL;
type SetNonStaticDataCellAction = Action<SetNonStaticDataCell> & {
  payload: {
    columnIdForColumn: ColumnId;
    rowIndex: number;
    value: string;
  };
};
export const setNonStaticDataCell = ({
  columnIdForColumn,
  rowIndex,
  value
}: {
  columnIdForColumn: ColumnId;
  rowIndex: number;
  value: string;
}): SetNonStaticDataCellAction => ({
  type: SET_NON_STATIC_DATA_CELL,
  payload: {
    columnIdForColumn,
    rowIndex,
    value
  }
});

export type ReducerActions =
  | LoadDataAction
  | SelectColumnAction
  | InitGridAction
  | SetFirstDataPointRowNumberAction
  | SetDataHeaderRowRangeAction
  | SetNonStaticDataCellAction;
