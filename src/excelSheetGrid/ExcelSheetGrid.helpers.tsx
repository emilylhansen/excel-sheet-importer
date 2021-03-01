import React from "react";
import { StaticDataCell } from "./StaticDataCell";
import { NonStaticDataCell } from "./NonStaticDataCell";
import { ColumnCell } from "./ColumnCell";
import { ParameterCell } from "./ParameterCell";
import {
  DATA_CELL_HEIGHT,
  ERROR_NOTIFICATION_CELL_HEIGHT,
  HEADER_CELL_HEIGHT
} from "./ExcelSheetGrid.constants";
import { FillerCellWrapper } from "./ExcelSheetGrid.components";

type ColumnCellInitializer = {
  tag: "column-cell-initializer";
};
type ParameterCellInitializer = {
  tag: "parameter-cell-initializer";
};
type StaticCellBody = { tag: "static-cell-body" };
type StaticCellTail = { tag: "static-cell-tail" };

type ColumnCellSubsequent = {
  tag: "column-cell-subsequent";
};
type ParameterCellSubsequent = {
  tag: "parameter-cell-subsequent";
};
type NonStaticCellPrimary = { tag: "non-static-cell-primary" };
type NonStaticCellSecondary = { tag: "non-static-cell-secondary" };

type FillerCell = { tag: "filler-cell" };

type CellTag =
  | ColumnCellInitializer
  | ParameterCellInitializer
  | StaticCellBody
  | StaticCellTail
  | ColumnCellSubsequent
  | ParameterCellSubsequent
  | NonStaticCellPrimary
  | NonStaticCellSecondary
  | FillerCell;

type GridProps = {
  style: React.CSSProperties;
  columnIndex: number;
  key: string;
  rowIndex: number;
};

type Cell = CellTag & GridProps;

export const getCell = ({
  rowIndex,
  columnIndex,
  isLastRowIndex,
  isLastDataPointRowIndex,
  style,
  key
}: {
  rowIndex: number;
  columnIndex: number;
  isLastRowIndex: boolean;
  isLastDataPointRowIndex: boolean;
  style: React.CSSProperties;
  key: string;
}): Cell => {
  const isInitializerColumn = columnIndex === 0;
  const isFirstRow = rowIndex === 0;
  const isSecondRow = rowIndex === 1;
  const isPrimary = rowIndex % 2 === 0;

  const gridProps: GridProps = {
    style,
    columnIndex,
    key,
    rowIndex
  };

  if (isInitializerColumn && isFirstRow) {
    return {
      tag: "column-cell-initializer",
      ...gridProps
    };
  }

  if (isInitializerColumn && isSecondRow) {
    return {
      tag: "parameter-cell-initializer",
      ...gridProps
    };
  }

  if (isInitializerColumn && !isLastRowIndex && !isLastDataPointRowIndex) {
    return { tag: "static-cell-body", ...gridProps };
  }

  if (isInitializerColumn && isLastDataPointRowIndex) {
    return { tag: "static-cell-tail", ...gridProps };
  }

  if (!isInitializerColumn && isFirstRow) {
    return {
      tag: "parameter-cell-subsequent",
      ...gridProps
    };
  }

  if (!isInitializerColumn && isSecondRow) {
    return { tag: "column-cell-subsequent", ...gridProps };
  }

  if (!isInitializerColumn && isPrimary && !isLastRowIndex) {
    return {
      tag: "non-static-cell-primary",
      ...gridProps
    };
  }

  if (!isInitializerColumn && !isPrimary && !isLastRowIndex) {
    return {
      tag: "non-static-cell-secondary",
      ...gridProps
    };
  }

  return { tag: "filler-cell", ...gridProps };
};

export const renderCell = (cell: Cell) => {
  switch (cell.tag) {
    case "column-cell-initializer":
      return (
        <ColumnCell
          style={cell.style}
          isInitializer
          columnIndex={cell.columnIndex}
          key={cell.key}
        />
      );
    case "parameter-cell-initializer":
      return (
        <ParameterCell
          style={cell.style}
          isInitializer
          columnIndex={cell.columnIndex}
          key={cell.key}
        />
      );
    case "static-cell-body":
      return (
        <StaticDataCell
          style={cell.style}
          isTail={false}
          rowIndex={cell.rowIndex}
          columnIndex={cell.columnIndex}
          key={cell.key}
        />
      );
    case "static-cell-tail":
      return (
        <StaticDataCell
          style={cell.style}
          isTail={true}
          rowIndex={cell.rowIndex}
          columnIndex={cell.columnIndex}
          key={cell.key}
        />
      );
    case "column-cell-subsequent":
      return (
        <ColumnCell
          style={cell.style}
          isInitializer={false}
          columnIndex={cell.columnIndex}
          key={cell.key}
        />
      );
    case "parameter-cell-subsequent":
      return (
        <ParameterCell
          style={cell.style}
          isInitializer={false}
          columnIndex={cell.columnIndex}
          key={cell.key}
        />
      );
    case "non-static-cell-primary":
      return (
        <NonStaticDataCell
          style={cell.style}
          display="primary"
          rowIndex={cell.rowIndex}
          columnIndex={cell.columnIndex}
          key={cell.key}
        />
      );
    case "non-static-cell-secondary":
      return (
        <NonStaticDataCell
          style={cell.style}
          display="secondary"
          rowIndex={cell.rowIndex}
          columnIndex={cell.columnIndex}
          key={cell.key}
        />
      );
    default:
      return <FillerCellWrapper style={cell.style} key={cell.key} />;
  }
};

export const getCellRowHeight = ({
  rowIndex,
  isLastRowIndex
}: {
  rowIndex: number;
  isLastRowIndex: boolean;
}) =>
  rowIndex < 2
    ? HEADER_CELL_HEIGHT
    : isLastRowIndex
    ? ERROR_NOTIFICATION_CELL_HEIGHT
    : DATA_CELL_HEIGHT;
