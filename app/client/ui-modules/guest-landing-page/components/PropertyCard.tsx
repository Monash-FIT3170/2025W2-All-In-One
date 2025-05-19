import React from "react";
import { CardWidget } from "../../role-dashboard/components/CardWidget";

interface PropertyCardProps {
  imageUrl: string;
  address: string;
  beds: number;
  baths: number;
  availability: string;
  pricePerWeek: string;
}

export function PropertyCard({
  imageUrl,
  address,
  beds,
  baths,
  availability,
  pricePerWeek,
}: PropertyCardProps) {
  return (
    <CardWidget
      title={address}
      value={pricePerWeek + " per week"}
      className="w-full max-w-sm overflow-hidden"
      children={
        <>
          <img src={imageUrl} alt={address} className="h-48 w-full object-cover rounded-t-lg" />
          <p className="text-sm text-gray-600 mt-2">
            {beds} bed • {baths} bath • {availability}
          </p>
        </>
      }
    />
  );
}
