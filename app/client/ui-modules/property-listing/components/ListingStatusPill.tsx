import React from "react";
import { twMerge } from "tailwind-merge";

export enum ListingStatusPillVariant {
  DRAFT,
  CURRENT,
}

export function ListingStatusPill({
  variant,
  text,
  className,
}: {
  variant: ListingStatusPillVariant;
  text: string;
  className?: string;
}): React.JSX.Element {
  const variantStyling: { [key in ListingStatusPillVariant]: string } = {
    [ListingStatusPillVariant.DRAFT]: "bg-(--status-orange-color) text-white",
    [ListingStatusPillVariant.CURRENT]: "bg-(--status-dark-blue-color) text-white",
  };

  return (
    <div
      className={twMerge(
        `${variantStyling[variant]} geist-semibold text-[24px] inline-block py-1.5 px-7 rounded-full`,
        className
      )}
    >
      {text}
    </div>
  );
}
