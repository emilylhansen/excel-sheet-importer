import React from "react";
import scrollbarSize from "dom-helpers/scrollbarSize";
import { ScrollSync, Grid, AutoSizer } from "react-virtualized";
import {
  ErrorNotificationsGridWrapper,
  ExcelSheetGridWrapper,
  FillerCellWrapper
} from "./ExcelSheetGrid.components";
import { ErrorNotificationCell } from "./ErrorNotificationCell";
import {
  COLUMN_WIDTH,
  ERROR_NOTIFICATION_CELL_HEIGHT
} from "./ExcelSheetGrid.constants";
import { pipe } from "fp-ts/lib/pipeable";
import {
  getCell,
  renderCell,
  getCellRowHeight
} from "./ExcelSheetGrid.helpers";
import { getDataRowCount, getGridRowCount, getColumnCount } from "../selectors";
import { useSelector } from "react-redux";

const OVERSCAN_COLUMN_COUNT = 5;
const OVERSCAN_ROW_COUNT = 5;

export const ExcelSheetGrid = () => {
  const dataRowCount = useSelector(getDataRowCount);
  const gridRowCount = useSelector(getGridRowCount);
  const columnCount = useSelector(getColumnCount);

  return (
    <ExcelSheetGridWrapper>
      <ScrollSync>
        {({
          clientHeight,
          clientWidth,
          onScroll,
          scrollHeight,
          scrollLeft,
          scrollTop,
          scrollWidth
        }) => {
          return (
            <AutoSizer>
              {({ width, height }) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: "1 1 auto"
                  }}
                >
                  <div
                    style={{
                      height: `${height - ERROR_NOTIFICATION_CELL_HEIGHT}px`,
                      width
                    }}
                  >
                    <Grid
                      style={{ width: "100%" }}
                      columnWidth={COLUMN_WIDTH}
                      columnCount={columnCount}
                      height={height}
                      onScroll={onScroll}
                      overscanColumnCount={OVERSCAN_COLUMN_COUNT}
                      overscanRowCount={OVERSCAN_ROW_COUNT}
                      cellRenderer={({ rowIndex, columnIndex, key, style }) => {
                        return pipe(
                          getCell({
                            rowIndex,
                            columnIndex,
                            style,
                            isLastRowIndex: rowIndex === gridRowCount - 1,
                            isLastDataPointRowIndex:
                              rowIndex === dataRowCount - 1,
                            key
                          }),
                          renderCell
                        );
                      }}
                      rowHeight={(r) =>
                        getCellRowHeight({
                          rowIndex: r.index,
                          isLastRowIndex: r.index === gridRowCount - 1
                        })
                      }
                      rowCount={gridRowCount}
                      width={width}
                    />
                  </div>
                  <ErrorNotificationsGridWrapper width={width}>
                    <Grid
                      style={{
                        width: "100%",
                        overflow: "hidden !important"
                      }}
                      columnWidth={COLUMN_WIDTH}
                      columnCount={columnCount}
                      height={ERROR_NOTIFICATION_CELL_HEIGHT}
                      overscanColumnCount={OVERSCAN_COLUMN_COUNT}
                      cellRenderer={({ key, style, columnIndex }) => {
                        const isInitializer = columnIndex === 0;

                        return isInitializer ? (
                          <FillerCellWrapper />
                        ) : (
                          <ErrorNotificationCell
                            key={key}
                            style={style}
                            columnIndex={columnIndex}
                          />
                        );
                      }}
                      rowHeight={ERROR_NOTIFICATION_CELL_HEIGHT}
                      rowCount={1}
                      scrollLeft={scrollLeft}
                      width={width - scrollbarSize()}
                    />
                  </ErrorNotificationsGridWrapper>
                </div>
              )}
            </AutoSizer>
          );
        }}
      </ScrollSync>
    </ExcelSheetGridWrapper>
  );
};
