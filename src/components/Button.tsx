import styled from "styled-components";

const Button = styled.button`
  text-transform: capitalize;
  background-color: transparent;
  border: 1px solid #0f0f0f28;
  color: #dd0055;
  border-radius: 4px;
  padding: 6px 12px;
  height: fit-content;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  :hover {
    background-color: #dd005505;
    border-color: #ac004236;
  }
`;

export default Button;
