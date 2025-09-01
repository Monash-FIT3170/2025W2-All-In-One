import React from "react";
import { SubHeading } from "/app/client/ui-modules/theming/components/SubHeading";
import { twMerge } from "tailwind-merge";

export function PropertyFeatures({
  featuresList,
  className = "",
}: {
  featuresList: string[];
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("w-[400px]", className)}>
      <SubHeading text="Features" className="block mb-2" />
      <FeaturesPillList featuresList={featuresList} />
    </div>
  );
}

function FeaturesPillList({
  featuresList,
  className = "",
}: {
  featuresList: string[];
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex flex-row flex-wrap gap-y-2", className)}>
      {featuresList.map((feature) => (
        <FeaturesPill key={feature} text={feature} className="mr-2" />
      ))}
    </div>
  );
}

function FeaturesPill({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}): React.JSX.Element {
  return (
    <span
      className={twMerge(
        "px-2 py-0.5 h-min text-[12px] bg-(--body-quaternary-color) rounded-full",
        className
      )}
    >
      {text}
    </span>
  );
}
