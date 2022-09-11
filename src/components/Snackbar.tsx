import React, { FC, MouseEventHandler } from "react";
import clsx from "clsx";
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

const Snackbar: FC<Prop> = ({ className, message, action }) => {
  return (
    <div className={clsx("cvh-snackbar", className)}>
      {message}
      {Boolean(action) && (
        <Button className="cvh-snackbar-btn" onClick={action?.onClick as any}>
          {action?.name}
        </Button>
      )}
    </div>
  );
};

export default Snackbar;
