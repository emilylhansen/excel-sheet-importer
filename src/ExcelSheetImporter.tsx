import React from "react";
import { ExcelSheetGrid } from "./excelSheetGrid/ExcelSheetGrid";
import { Header } from "./Header";
import { Footer } from "./Footer";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { loadData } from "./actions";
import { Colors } from "./helpers";
import styled from "styled-components";
import Popover from "@material-ui/core/Popover";
const data = require("./data.json");

const ExcelSheetImporterWrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
`;

const ModalWrapper = styled.div`
  display: flex;
  flex-flow: column;
  box-shadow: 3px 3px 9px #888888;
  flex: 1;
`;

const ModalContent = styled.div`
  background-color: ${Colors.LightGrey};
  flex: 1;
  padding: 24px 40px;
  display: flex;
  flex-flow: column;
`;

const ImportButtonWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const useExcelSheetImporter = () => {
  const [anchorEl, setAnchorEl] = React.useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);

  const isOpen = Boolean(anchorEl);

  const onOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(e.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();

  const onImport = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onOpen(e);
    dispatch(loadData(data));
  };

  return { isOpen, onClose, onOpen, onImport, anchorEl };
};

export const ExcelSheetImporter = () => {
  const state = useExcelSheetImporter();

  return (
    <ExcelSheetImporterWrapper>
      <ImportButtonWrapper>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={state.onImport}
          style={{ backgroundColor: Colors.DarkBlue }}
        >
          Import
        </Button>
      </ImportButtonWrapper>
      <Popover
        PaperProps={{
          style: {
            display: "flex",
            left: "16px",
            right: "16px",
            bottom: "16px",
            top: "16px",
          },
        }}
        marginThreshold={16}
        open={state.isOpen}
        anchorEl={state.anchorEl}
        onClose={state.onClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <ModalWrapper>
          <ModalContent>
            <Header onCloseModal={state.onClose} />
            <ExcelSheetGrid />
          </ModalContent>
          <Footer onCloseModal={state.onClose} />
        </ModalWrapper>
      </Popover>
    </ExcelSheetImporterWrapper>
  );
};
