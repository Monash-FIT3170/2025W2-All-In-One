import React from "react";
import { twMerge } from "tailwind-merge";

export function IconButton({
  icon,
  onClick,
  className = "",
}: {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <button onClick={onClick} className={twMerge("cursor-pointer", className)}>
      {icon}
    </button>
  );
}
