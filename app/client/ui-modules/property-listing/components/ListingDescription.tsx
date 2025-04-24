import React from "react";
import { twMerge } from "tailwind-merge";

export function ListingDescription({
  description,
  className = "",
}: {
  description: string;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex flex-col", className)}>
      <span className="geist-semibold text-[18px] mb-1">Description</span>
      <span className="geist-regular text-[16px]">{description}</span>
    </div>
  );
}