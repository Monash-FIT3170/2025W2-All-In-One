import React from "react";
import { CardWidget } from "../../common/CardWidget";

export function PropertyCardBlank() {
  return (
    <div className="w-full block">
      <CardWidget
        title=""
        value=""
        className="w-full overflow-hidden h-full flex flex-col text-center"
      >
        {/* Image */}
        <div className="relative">
          <div className="h-48 w-full bg-gray-300 animate-pulse" />
          {/* Status Pill */}
          <div className="absolute top-2 right-2 h-5 w-16 bg-gray-400 rounded-full animate-pulse" />
        </div>

        <div className="mt-4 space-y-2 flex-grow">
          {/* Address Line */}
          <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
          {/* Suburb & Postcode */}
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>

          {/* Features (beds, baths, inspections) */}
          <div className="flex justify-center items-center gap-6 mt-3">
            <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
          </div>

          {/* Price */}
          <div className="h-5 bg-gray-300 rounded w-1/3 mx-auto mt-4 animate-pulse"></div>
        </div>
      </CardWidget>
    </div>
  );
}
