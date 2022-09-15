import styled from "styled-components";

const Button = styled.button`
  text-transform: uppercase;
  background-color: transparent;
  border: none;
  color: #dd0055;
  border-radius: 4px;
  padding: 6px 12px;
  height: fit-content;
  font-weight: 500;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  :hover {
    background-color: #dd005505;
    border-color: #ac004236;
  }
`;

export default Button;
