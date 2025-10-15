import React from "react";
import { twMerge } from "tailwind-merge";
import { SubHeading } from "/app/client/ui-modules/theming/components/SubHeading";

export function ListingDates({
  startLeaseDate,
  endLeaseDate,
  leaseTerm,
  className = "",
}: {
  startLeaseDate: Date;
  endLeaseDate: Date;
  leaseTerm: string;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex flex-col", className)}>
      <SubHeading text="Lease Dates" className="mb-1" />
      <span className="geist-regular text-[16px]">Start Date: {startLeaseDate.toDateString()}</span>
      <span className="geist-regular text-[16px]">End Date: {endLeaseDate.toDateString()}</span>
      <span className="geist-regular text-[16px]">Lease Term: {leaseTerm}</span>
    </div>
  );
}