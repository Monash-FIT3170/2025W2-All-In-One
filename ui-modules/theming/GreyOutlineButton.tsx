import React, { useState, ButtonHTMLAttributes } from "react";
import "./buttons.css";

interface GreyOutlineButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const GreyOutlineButton: React.FC<GreyOutlineButtonProps> = ({
  children,
  className = "",
  onClick,
  ...rest
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setClicked(true);
    onClick?.(e);
  };

  const combinedClassName = `button-outline-grey ${
    clicked ? "clicked" : ""
  } ${className}`.trim();

  return (
    <button className={combinedClassName} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
};

export default GreyOutlineButton;
