import React from "react";
import { twMerge } from "tailwind-merge";
import { SubHeading } from "/app/client/ui-modules/theming/components/SubHeading";

export function PropertyDescription({
  description,
  className = "",
}: {
  description: string;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex flex-col", className)}>
      <SubHeading text="Description" className="mb-1" />
      <span className="geist-regular text-[16px]">{description}</span>
    </div>
  );
}