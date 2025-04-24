import React from "react";
import { twMerge } from "tailwind-merge";

export function BackLink({
  label,
  backButtonIcon,
  onClick,
  className = "",
}: {
  label: string;
  backButtonIcon: React.ReactNode;
  onClick: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <button
      className={twMerge(
        "flex flex-row w-fit text-(--body-secondary-color) items-center cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <span className="mr-3">{backButtonIcon}</span>
      <span className="geist-medium mt-[1px]">{label}</span>
    </button>
  );
}
