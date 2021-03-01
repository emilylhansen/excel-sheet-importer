import React from "react";
import styled, { css } from "styled-components";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import * as R from "fp-ts/lib/Record";
import { pipe } from "fp-ts/lib/pipeable";
import { Label } from "../components";
import { Colors } from "../helpers";
import { HeaderCellWrapper, CellContent } from "./ExcelSheetGrid.components";
import { useSelector } from "react-redux";
import { ColumnItem } from "../types";
import {
  getDataForColumnIndex,
  getColumnCount,
  getAvailableColumnItemsByColumnId,
  getBlobColumnItemsByColumnId
} from "../selectors";
import { selectColumn, initGrid } from "../actions";
import { useDispatch } from "react-redux";

const SKIP_ITEM = "SKIP_ITEM";

const ColumnCellContent = styled(CellContent)<{
  isInitializer: boolean;
}>`
  ${({ isInitializer }) => css`
    margin: ${isInitializer ? "8px 8px 0" : "0 8px"};
    background: ${isInitializer ? Colors.DarkBlue : "white"};
  `}

  display: flex;
  flex-flow: column;
  border-radius: 8px 8px 0 0;
  padding: 16px;
`;

type Props = {
  style: React.CSSProperties;
  isInitializer: boolean;
  columnIndex: number;
};

const useColumnCell = (props: Props) => {
  const dispatch = useDispatch();

  const dataForColumnIndex = useSelector(
    getDataForColumnIndex(props.columnIndex)
  );
  const columnCount = useSelector(getColumnCount);
  const availableColumnDataByColumnId = useSelector(
    getAvailableColumnItemsByColumnId
  );
  const blobColumnItemsByColumnId = useSelector(getBlobColumnItemsByColumnId);

  const getColumnValue = (items: O.Option<Array<ColumnItem>>): string =>
    pipe(
      items,
      O.chain(A.head),
      O.map((h) => h.value),
      O.getOrElse(() => "")
    );

  const selectedColumnIdO = pipe(
    dataForColumnIndex,
    O.chain((d) => d.column),
    O.map((c) => c.columnId)
  );

  const selectedColumnId = pipe(
    selectedColumnIdO,
    O.getOrElse(() => "")
  );

  const selectedColumnValue = pipe(
    selectedColumnIdO,
    O.chain((scId) => pipe(blobColumnItemsByColumnId, O.chain(R.lookup(scId)))),
    getColumnValue
  );

  const handleOnChange = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const columnIdValue = String(e.target.value);

    const columnIdForParameter = pipe(
      dataForColumnIndex,
      O.map((d) => d.parameter),
      O.map((p) => p.columnId)
    );

    if (O.isSome(columnIdForParameter)) {
      const columnIdForColumn =
        columnIdValue === SKIP_ITEM ? O.none : O.some(columnIdValue);

      const isInitialized = columnCount === 1;

      if (!isInitialized) {
        dispatch(
          selectColumn({
            columnIdForParameter: columnIdForParameter.value,
            columnIdForColumn,
            columnIndex: props.columnIndex
          })
        );
      } else {
        dispatch(
          initGrid({
            columnIdForParameter: columnIdForParameter.value,
            columnIdForColumn,
            columnIndex: props.columnIndex
          })
        );
      }
    }
  };

  return {
    handleOnChange,
    selectedColumnId,
    selectedColumnValue,
    availableColumnDataByColumnId,
    getColumnValue
  };
};

export const ColumnCell = (props: Props) => {
  const state = useColumnCell(props);

  return (
    <HeaderCellWrapper style={props.style}>
      <ColumnCellContent isInitializer={props.isInitializer}>
        <Label gray={!props.isInitializer}>Select Column</Label>
        <Select
          onChange={state.handleOnChange}
          variant="outlined"
          value={state.selectedColumnId}
          style={{ fontSize: 16, fontWeight: 600, maxWidth: "152px" }}
        >
          <MenuItem value={SKIP_ITEM} key={SKIP_ITEM}>
            <em>(Skip)</em>
          </MenuItem>
          <MenuItem value={state.selectedColumnId} key={state.selectedColumnId}>
            {state.selectedColumnValue}
          </MenuItem>
          {pipe(
            state.availableColumnDataByColumnId,
            R.toArray,
            A.map(([k, v]) => (
              <MenuItem value={k} key={k}>
                {state.getColumnValue(O.some(v))}
              </MenuItem>
            ))
          )}
        </Select>
      </ColumnCellContent>
    </HeaderCellWrapper>
  );
};
