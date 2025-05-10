import React from "react";

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
    <div className="rounded-xl overflow-hidden shadow-md bg-white w-full max-w-sm">
      <img src={imageUrl} alt={address} className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-md">{address}</h3>
        <p className="text-sm text-gray-600">
          {beds} bed • {baths} bath • {availability}
        </p>
        <p className="text-base font-medium mt-2">{pricePerWeek} per week</p>
      </div>
    </div>
  );
}
