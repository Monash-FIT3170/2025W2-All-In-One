import React from "react";
import "./buttons.css";

type Props = {
  variant?: "black" | "white" | "outline-black" | "outline-white" | "disabled";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const PrimaryButton: React.FC<Props> = ({
  children,
  variant = "black",
  ...props
}) => {
  return (
    <button className={`button-primary --${variant}`} {...props}>
      {children}
    </button>
  );
};

export default PrimaryButton;
