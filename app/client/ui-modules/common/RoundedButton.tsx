import React from "react";
import { twMerge } from "tailwind-merge";

export function RoundedButton({
  onClick,
  children,
  className = "",
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "bg-(--body-quaternary-color) rounded-full cursor-pointer",
        className
      )}
    >
      {children}
    </button>
  );
}
