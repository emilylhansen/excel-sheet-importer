import React from "react";
import styled, { css } from "styled-components";
import Typography from "@material-ui/core/Typography";
import { Label } from "../components";
import { Colors } from "../helpers";
import { HeaderCellWrapper, CellContent } from "./ExcelSheetGrid.components";
import { useSelector } from "react-redux";
import { getDataForColumnIndex } from "../selectors";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

const ParameterCellContent = styled(CellContent)<{
  isInitializer: boolean;
}>`
  ${({ isInitializer }) => css`
    margin: ${isInitializer ? "0 8px" : "8px 8px 0"};
    background: ${isInitializer ? Colors.DarkBlue : "white"};
  `}
  text-align: left;
  padding: 16px;
`;

type Props = {
  style: React.CSSProperties;
  isInitializer: boolean;
  columnIndex: number;
};

const useParameterCell = (props: Props) => {
  const dataForColumnIndex = useSelector(
    getDataForColumnIndex(props.columnIndex)
  );

  const parameter = pipe(
    dataForColumnIndex,
    O.map((d) => d.parameter.data),
    O.chain(A.head),
    O.map((h) => h.value),
    O.getOrElse(() => ""),
    (t) => `${t}${props.isInitializer ? "*" : ""}`
  );

  return { parameter };
};
export const ParameterCell = (props: Props) => {
  const state = useParameterCell(props);

  return (
    <HeaderCellWrapper style={props.style}>
      <ParameterCellContent isInitializer={props.isInitializer}>
        <Label gray={!props.isInitializer}>Parameter</Label>
        <Typography
          variant="subtitle2"
          gutterBottom
          style={{
            fontSize: "16px",
            fontWeight: 600,
            textAlign: "left"
          }}
        >
          {state.parameter}
        </Typography>
      </ParameterCellContent>
    </HeaderCellWrapper>
  );
};
