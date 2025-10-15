import React from "react";
import { twMerge } from "tailwind-merge";
import { SubHeading } from "/app/client/ui-modules/theming/components/SubHeading";

interface ListingDatesProps {
  startLeaseDate: Date;
  endLeaseDate: Date;
  leaseTerm: string;
  className?: string;
}

export function ListingDates({
  startLeaseDate,
  endLeaseDate,
  leaseTerm,
  className = "",
}: ListingDatesProps): React.JSX.Element {
  const formattedDates = new Intl.DateTimeFormat("en-AU", { dateStyle: "medium" });

  const details = [
    { label: "Available from", value: formattedDates.format(startLeaseDate) },
    { label: "Available until", value: formattedDates.format(endLeaseDate) },
    { label: "Lease Agreement Terms", value: leaseTerm },
  ];

  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm",
        className
      )}
    >
      <SubHeading text="Lease Dates" className="mb-2" />
      {details.map(({ label, value }) => (
        <div
          key={label}
          className="flex justify-between border-b border-gray-200 pb-1 last:border-b-0"
        >
          <span className="geist-regular font-semibold">{label}:</span>
          <span className="geist-regular">{value}</span>
        </div>
      ))}
    </div>
  );
}
