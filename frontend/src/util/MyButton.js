import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

const MyButton = ({
  children,
  onClick,
  tip,
  btnClassName,
  tipClassName,
  placement,
}) => {
  return (
    <IconButton onClick={onClick} className={btnClassName}>
      <Tooltip title={tip} className={tipClassName} placement={placement} arrow>
        {children}
      </Tooltip>
    </IconButton>
  );
};
export default MyButton;
