import React from "react";
import { twMerge } from "tailwind-merge";

export function SubHeading({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}): React.JSX.Element {
  return (
    <span className={twMerge("geist-semibold text-[18px]", className)}>
      {text}
    </span>
  );
}
