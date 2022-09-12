import React, { FC, HTMLProps, ReactNode } from "react";
import styled from "styled-components";
import Button from "./Button";

const IconButton = styled(Button).attrs({
  className: "cvh-flex cvh-center",
})`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 16px;
  padding: 0;
  border: none;
`;

export default IconButton;
