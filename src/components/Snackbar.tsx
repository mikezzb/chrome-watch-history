import React, { FC, MouseEventHandler } from "react";
import clsx from "clsx";
import styled from "styled-components";
import Button from "./Button";

type Action = {
  name: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

type Prop = {
  className?: string;
  message: string;
  action?: Action;
};

const Bar = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 2000;
  bottom: 30px;
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
  right: 2.5%;
  left: 2.5%;
  align-items: center;
  background-color: #121212;
  color: white;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
`;

const SnackbarBtn = styled(Button)`
  margin-left: 12px;
`;

const Snackbar: FC<Prop> = ({ className, message, action }) => {
  return (
    <Bar className={clsx("cvh-snackbar", className)}>
      {message}
      {Boolean(action) && (
        <SnackbarBtn
          className="cvh-snackbar-btn"
          onClick={action?.onClick as any}
        >
          {action?.name}
        </SnackbarBtn>
      )}
    </Bar>
  );
};

export default Snackbar;
