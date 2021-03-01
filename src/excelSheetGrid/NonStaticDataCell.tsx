import React from "react";
import styled, { css } from "styled-components";
import Warning from "@material-ui/icons/Warning";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { Colors } from "../helpers";
import { CellContent, DataCellWrapper } from "./ExcelSheetGrid.components";
import { getDataForColumnIndex } from "../selectors";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { useSelector, useDispatch } from "react-redux";
import { setNonStaticDataCell } from "../actions";

const NonStaticDataCellContent = styled(CellContent)<{
  color: string;
}>`
  ${({ color }) => css`
    background-color: ${color};
    border-right: 1px solid ${Colors.DarkGrey};
    border-left: 1px solid ${Colors.DarkGrey};

    fieldset {
      border-color: ${color};
    }

    .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: ${color};
    }

    .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${color};
    }

    .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
      border-color: ${color};
    }
  `}
  padding: 0 8px;
`;

type Props = {
  style: React.CSSProperties;
  display: "primary" | "secondary";
  columnIndex: number;
  rowIndex: number;
};

const useNonStaticDataCell = (props: Props) => {
  const dispatch = useDispatch();

  const dataForColumnIndex = useSelector(
    getDataForColumnIndex(props.columnIndex)
  );

  const columnO = pipe(
    dataForColumnIndex,
    O.chain((c) => c.column)
  );

  const isDisabled = pipe(columnO, O.isNone);

  const value = pipe(
    columnO,
    O.map((c) => c.data),
    O.chain(A.lookup(props.rowIndex)),
    O.map((r) => r.value)
  );

  const color = props.display === "primary" ? "white" : Colors.LightGrey;

  const isEmptyValue = pipe(
    value,
    O.map((v) => v === ""),
    O.getOrElse(() => false)
  );

  const handleOnChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) =>
    pipe(
      dataForColumnIndex,
      O.chain((d) => d.column),
      O.map((c) => {
        dispatch(
          setNonStaticDataCell({
            columnIdForColumn: c.columnId,
            rowIndex: props.rowIndex,
            value: e.target.value
          })
        );
      }),
      O.toUndefined
    );

  return { color, isEmptyValue, value, handleOnChange, isDisabled };
};

export const NonStaticDataCell = (props: Props) => {
  const state = useNonStaticDataCell(props);

  return (
    <DataCellWrapper style={props.style}>
      <NonStaticDataCellContent color={state.color}>
        <OutlinedInput
          disabled={state.isDisabled}
          value={pipe(
            state.value,
            O.getOrElse(() => "")
          )}
          onChange={state.handleOnChange}
          autoFocus={false}
          endAdornment={
            state.isEmptyValue ? (
              <InputAdornment position="end">
                <Warning style={{ color: Colors.Error }} />
              </InputAdornment>
            ) : undefined
          }
        />
      </NonStaticDataCellContent>
    </DataCellWrapper>
  );
};
