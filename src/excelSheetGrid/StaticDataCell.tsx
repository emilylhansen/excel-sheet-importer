import { CellContent, DataCellWrapper } from "./ExcelSheetGrid.components";
import React from "react";
import styled, { css } from "styled-components";
import Typography from "@material-ui/core/Typography";
import { Colors } from "../helpers";
import { useSelector } from "react-redux";
import { getDataForColumnIndex } from "../selectors";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

const StaticDataCellContent = styled(CellContent)`
  width: 100%;
  align-items: center;
  border-right: 1px solid ${Colors.DarkGrey};
  border-left: 1px solid ${Colors.DarkGrey};
`;

const CardWrapper = styled.div<{ isTail: boolean }>`
  ${({ isTail }) => css`
    margin: ${isTail ? "0 8px 8px" : "0 8px"};
    border-radius: ${isTail ? "0 0 8px 8px" : 0};
  `}
  padding: 0 16px;
  background: ${Colors.DarkBlue};
  height: 100%;
  display: block;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextWrapper = styled.div`
  width: 100%;
  border-top: 1px solid;
  border-bottom: 1px solid;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = {
  style: React.CSSProperties;
  rowIndex: number;
  columnIndex: number;
  isTail: boolean;
};

const useStaticDataCell = (props: Props) => {
  const dataForColumnIndex = useSelector(
    getDataForColumnIndex(props.columnIndex)
  );

  const text = pipe(
    dataForColumnIndex,
    O.chain((d) => d.column),
    O.map((c) => c.data),
    O.chain(A.lookup(props.rowIndex)),
    O.map((r) => r.value),
    O.getOrElse(() => "")
  );

  return { text };
};

export const StaticDataCell = (props: Props) => {
  const state = useStaticDataCell(props);

  return (
    <DataCellWrapper style={props.style}>
      <StaticDataCellContent>
        <CardWrapper isTail={props.isTail}>
          <TextWrapper>
            <Typography variant="subtitle2" style={{ fontSize: "16px" }}>
              {state.text}
            </Typography>
          </TextWrapper>
        </CardWrapper>
      </StaticDataCellContent>
    </DataCellWrapper>
  );
};
