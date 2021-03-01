import React from "react";
import Typography from "@material-ui/core/Typography";
import Close from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AppsIcon from "@material-ui/icons/Apps";
import GridOnIcon from "@material-ui/icons/GridOn";
import styled from "styled-components";
import { Label } from "./components";
import { Colors, parseDataHeaderRowRange } from "./helpers";
import { useSelector } from "react-redux";
import {
  getFilename,
  getFirstDataPointRowNumber,
  getDataHeaderRowRange,
  getMaxDataRowCount
} from "./selectors";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { useDispatch } from "react-redux";
import { setFirstDataPointRowNumber, setDataHeaderRowRange } from "./actions";

const HeaderWrapper = styled.div`
  display: flex;
  flex-flow: column;
  margin-bottom: 40px;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const HeaderBottom = styled.div`
  display: flex;
  align-items: center;
`;

const RowNumberInputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-right: 64px;
`;

const InputWrapper = styled.div`
  justify-content: flex-start;
  display: flex;
  flex-flow: column;
  margin-left: 8px;
`;

type Props = { onCloseModal: () => void };

const useHeader = (props: Props) => {
  const dispatch = useDispatch();

  const filenameO = useSelector(getFilename);
  const firstDataPointRowNumber = useSelector(getFirstDataPointRowNumber);
  const dataHeaderRowRange = useSelector(getDataHeaderRowRange);
  const maxDataRowCount = useSelector(getMaxDataRowCount);

  const filename = pipe(
    filenameO,
    O.getOrElse(() => "N/A")
  );

  const handleOnChangeFirstDataPointRowNumber = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const rowNumber = Number(e.target.value);
    const isValid =
      !isNaN(rowNumber) &&
      rowNumber > 1 &&
      rowNumber < maxDataRowCount &&
      rowNumber > parseDataHeaderRowRange(dataHeaderRowRange);

    if (isValid) {
      dispatch(setFirstDataPointRowNumber(rowNumber));
    }
  };

  return {
    filename,
    firstDataPointRowNumber,
    dataHeaderRowRange,
    dispatch,
    handleOnChangeFirstDataPointRowNumber
  };
};

export const Header = (props: Props) => {
  const state = useHeader(props);

  return (
    <HeaderWrapper>
      <HeaderTop>
        <Typography
          style={{ color: Colors.LightBlue }}
        >{`Import from "${state.filename}"`}</Typography>
        <IconButton
          color="primary"
          component="span"
          style={{ border: `1px solid ${Colors.DarkBlue}` }}
          size="small"
          onClick={props.onCloseModal}
        >
          <Close style={{ color: Colors.DarkBlue }} />
        </IconButton>
      </HeaderTop>
      <HeaderBottom>
        <RowNumberInputWrapper>
          <AppsIcon style={{ marginBottom: "12px" }} />
          <InputWrapper>
            <Label>Row Nr(s). of Data Header</Label>
            <TextField
              id="standard-basic"
              value={state.dataHeaderRowRange}
              onChange={(e) =>
                state.dispatch(setDataHeaderRowRange(e.target.value))
              }
            />
          </InputWrapper>
        </RowNumberInputWrapper>
        <RowNumberInputWrapper>
          <GridOnIcon style={{ marginBottom: "12px" }} />
          <InputWrapper>
            <Label>Row Nr(s). of First Data Point</Label>
            <TextField
              id="standard-basic"
              type="number"
              value={state.firstDataPointRowNumber}
              onChange={state.handleOnChangeFirstDataPointRowNumber}
            />
          </InputWrapper>
        </RowNumberInputWrapper>
      </HeaderBottom>
    </HeaderWrapper>
  );
};
