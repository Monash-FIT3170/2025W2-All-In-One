import React from "react";
import { twMerge } from "tailwind-merge";

export function ListingPropertyDetails({
  propertyType,
  area,
  bathrooms,
  parking,
  bedrooms,
  price,
  className = "",
}: {
  propertyType: string;
  area: string;
  bathrooms: string;
  parking: string;
  bedrooms: string;
  price: string;
  className?: string;
}): React.JSX.Element {
  return (
    <div
      className={twMerge("grid grid-cols-2 grid-rows-3 gap-y-3 gap-x-5 w-fit", className)}
    >
      <PropertyDetailEntry label="Type" text={propertyType} />
      <PropertyDetailEntry
        label="Price"
        text={price}
        textColorClass="text-(--button-blue-color)"
      />
      
      <PropertyDetailEntry label="Bedrooms" text={bedrooms} />
      <PropertyDetailEntry label="Parking" text={parking} />

      <PropertyDetailEntry label="Bathrooms" text={bathrooms} />
      <PropertyDetailEntry label="Area" text={area} />
      
    </div>
  );
}

function PropertyDetailEntry({
  label,
  text,
  textColorClass="",
  className = "",
}: {
  label: string;
  text: string;
  textColorClass?: string;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex flex-col border border-(--divider-color) rounded-md p-2", className)}>
      <span className="geist-regular text-[14px] text-(--body-secondary-color)">
        {label}
      </span>
      <span className={`geist-medium text-[16px] ${textColorClass}`}>
        {text}
      </span>
    </div>
  );
}
