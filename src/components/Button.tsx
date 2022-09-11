import React, { FC, MouseEventHandler } from "react";
import clsx from "clsx";

type Prop = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

const Button: FC<Prop> = ({ children, onClick, className }) => {
  return (
    <button className={clsx(className, "cvh-btn")} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
