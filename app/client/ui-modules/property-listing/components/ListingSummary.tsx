import React from "react";
import { twMerge } from "tailwind-merge";

export enum PropertyStatusPillVariant {
  VACANT,
}

export function ListingSummary({
  streetNumber,
  street,
  suburb,
  province,
  postcode,
  summaryDescription,
  propertyStatusText,
  propertyStatusPillVariant,
  className = "",
}: {
  streetNumber: string;
  street: string;
  suburb: string;
  province: string;
  postcode: string;
  summaryDescription: string;
  propertyStatusText: string;
  propertyStatusPillVariant: PropertyStatusPillVariant;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex flex-col", className)}>
      <div className="flex flex-row items-center">
        <Address
          streetNumber={streetNumber}
          street={street}
          suburb={suburb}
          province={province}
          postcode={postcode}
          className="mr-6"
        />
        <StatusPill text={propertyStatusText} variant={propertyStatusPillVariant} />
      </div>

      <Description description={summaryDescription} />
    </div>
  );
}

function Address({
  streetNumber,
  street,
  suburb,
  province,
  postcode,
  className = "",
}: {
  streetNumber: string;
  street: string;
  suburb: string;
  province: string;
  postcode: string;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex flex-row items-end", className)}>
      <span className="geist-semibold text-[20px] mr-3">{`${streetNumber} ${street}`}</span>
      <span className="geist-regular text-[17px]">{`${suburb}, ${province}, ${postcode}`}</span>
    </div>
  );
}

function Description({
  description,
  className = "",
}: {
  description: string;
  className?: string;
}): React.JSX.Element {
  return (
    <span className={twMerge("geist-regular text-(--body-tertiary-color)", className)}>
      {description}
    </span>
  );
}

function StatusPill({
  text,
  variant,
  className = "",
}: {
  text: string;
  variant: PropertyStatusPillVariant;
  className?: string;
}): React.JSX.Element {
  const bgColorClass = (() => {
    switch (variant) {
      case PropertyStatusPillVariant.VACANT:
        return "bg-(--status-green-color)";
    }
  })();

  return (
    <span
      className={twMerge(`px-5 py-0.5 text-[12px] rounded-full ${bgColorClass}`, className)}
    >
      {text}
    </span>
  );
}
