import styled, { css } from "styled-components";
import {
  COLUMN_WIDTH,
  DATA_CELL_HEIGHT,
  HEADER_CELL_HEIGHT,
  ERROR_NOTIFICATION_CELL_HEIGHT
} from "./ExcelSheetGrid.constants";
import { Colors } from "../helpers";
import scrollbarSize from "dom-helpers/scrollbarSize";

export const ExcelSheetGridWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  background-color: white;
  box-shadow: 3px 3px 9px #888888;
  border-radius: 4px;
`;

export const ErrorNotificationsGridWrapper = styled.div<{ width: number }>`
  ${({ width }) => css`
    width: ${width - scrollbarSize()}px;
  `};

  height: ${ERROR_NOTIFICATION_CELL_HEIGHT}px;

  .ReactVirtualized__Grid__innerScrollContainer {
    height: ${ERROR_NOTIFICATION_CELL_HEIGHT}px !important;
    max-height: ${ERROR_NOTIFICATION_CELL_HEIGHT}px !important;
  }
`;

export const CellContent = styled.div`
  position: relative;
  flex: 1;
`;

export const HeaderCellWrapper = styled.div`
  width: ${COLUMN_WIDTH}px;
  height: ${HEADER_CELL_HEIGHT}px;
  display: flex;
  border-right: 1px solid ${Colors.DarkGrey};
  border-left: 1px solid ${Colors.DarkGrey};
`;

export const DataCellWrapper = styled.div`
  width: ${COLUMN_WIDTH}px;
  height: ${DATA_CELL_HEIGHT}px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
`;

export const FillerCellWrapper = styled.div``;
