import React from "react";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import { Colors } from "./helpers";
import { getBlobForServer } from "./selectors";
import { useSelector } from "react-redux";

const FooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
`;

type Props = { onCloseModal: () => void };

export const Footer = (props: Props) => {
  const blobForServer = useSelector(getBlobForServer);

  return (
    <FooterWrapper>
      <Button
        variant="outlined"
        style={{ marginRight: "8px" }}
        size="small"
        onClick={props.onCloseModal}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => {
          props.onCloseModal();
          console.log({ blobForServer });
        }}
        style={{ backgroundColor: Colors.DarkBlue }}
      >
        Export
      </Button>
    </FooterWrapper>
  );
};
