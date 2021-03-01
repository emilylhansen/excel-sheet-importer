import React from "react";
import styled from "styled-components";
import {
  COLUMN_WIDTH,
  ERROR_NOTIFICATION_CELL_HEIGHT
} from "./ExcelSheetGrid.constants";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Warning from "@material-ui/icons/Warning";
import { Colors } from "../helpers";
import { useSelector } from "react-redux";
import { getDataForColumnIndex } from "../selectors";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { ColumnItem } from "../types";

const ErrorNotificationCellWrapper = styled.div`
  width: ${COLUMN_WIDTH}px !important;
  height: ${ERROR_NOTIFICATION_CELL_HEIGHT}px !important;
  display: flex;

  .MuiCardContent-root:last-child {
    padding-bottom: 16px;
  }
`;

const ErrorNotificationContents = styled.div`
  position: relative;
  padding: 8px 16px;
  flex: 1;
`;

const ErrorNotificationText = styled.div`
  display: flex;
  flex-flow: row;
`;

const pluralize = ({ word, count }: { word: string; count: number }): string =>
  count > 1 ? word + "s" : word;

type Props = {
  style: React.CSSProperties;
  columnIndex: number;
};

export const useErrorNotificationCell = (props: Props) => {
  const dataForColumnIndex = useSelector(
    getDataForColumnIndex(props.columnIndex)
  );

  const errorCount = pipe(
    dataForColumnIndex,
    O.chain((d) => d.column),
    O.map((c) => c.data),
    O.map(A.filter((cItem) => cItem.value === "")),
    O.getOrElse<Array<ColumnItem>>(() => []),
    (emptyColumnItems) => emptyColumnItems.length
  );

  const canShowError = errorCount > 0;

  const warningMessage = `${errorCount} ${pluralize({
    word: "Error",
    count: errorCount
  })} Found`;

  return { canShowError, warningMessage };
};

export const ErrorNotificationCell = (props: Props) => {
  const state = useErrorNotificationCell(props);

  return (
    <ErrorNotificationCellWrapper style={props.style}>
      <ErrorNotificationContents>
        {state.canShowError && (
          <Card
            style={{
              backgroundColor: Colors.Error,
              color: "white"
            }}
          >
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <ErrorNotificationText>
                <Warning style={{ marginRight: "8px" }} />
                <Typography variant="subtitle2" style={{ fontWeight: 600 }}>
                  {state.warningMessage}
                </Typography>
              </ErrorNotificationText>
            </CardContent>
          </Card>
        )}
      </ErrorNotificationContents>
    </ErrorNotificationCellWrapper>
  );
};
