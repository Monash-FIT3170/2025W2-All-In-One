// components/PropertyDetails.tsx
import React from "react";
import { useNavigate } from "react-router";
import { NavigationPath } from "/app/client/navigation";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { LeftCircularArrowIcon } from "/app/client/ui-modules/theming/icons/LeftCircularArrowIcon";
import { RightCircularArrowIcon } from "/app/client/ui-modules/theming/icons/RightCircularArrowIcon";
import { ImageCarousel } from "../../../theming/components/ImageCarousel";

interface PropertyDetailsProps {
  property: Property | null;
  listing: string[];
}

export function PropertyDetails({
  property,
  listing
}: PropertyDetailsProps): React.JSX.Element {
  const navigate = useNavigate();

  const handleViewDetailsClick = () => {
    navigate(NavigationPath.TenantProperty);
  };

  // If no property, show "No Property Found" message
  if (!property) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
        <h2 className="text-3xl font-bold mb-2">Property Details</h2>
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-xl font-bold mb-2">No Property Found</h3>
          <p className="text-gray-600 text-center">
            Please contact your landlord or agent for more information.
          </p>
        </div>
      </div>
    );
  }

  // Format the full property
  const fullPropertyAddress = [
    `${property.streetname}`,
    `${property.suburb}, ${property.postcode} ${property.province}`,
  ];

  return (
    <div className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
      <h2 className="text-3xl font-bold mb-2">Property Details</h2>
      <p className="text-gray-600 mb-6">Your current residence</p>

      {/* Property Images */}
      {listing.length > 0 ? (
        <div className="mb-6">
          <ImageCarousel 
            imageUrls={listing}
            leftArrowIcon={<LeftCircularArrowIcon />}
            rightArrowIcon={<RightCircularArrowIcon />}
            className="fw-full max-w-[600px] mx-auto" />
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg mb-6 flex flex-col items-center justify-center h-64">
          <svg 
            className="w-12 h-12 text-gray-400 mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-gray-500 text-center">
            No property images available
          </p>
        </div>
      )}

      {/* property Section */}
      <div className="mb-6">
        <h3 className="text-gray-500 font-medium mb-1">Property</h3>
        <p className="text-xl font-bold">{fullPropertyAddress[0]}</p>
        <p className="text-xl">{fullPropertyAddress[1]}</p>
      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
        <div>
          <h3 className="text-gray-500 font-medium">Property Type</h3>
          <p className="text-xl font-bold">{property.type}</p>
        </div>

        <div>
          <h3 className="text-gray-500 font-medium">Area</h3>
          <p className="text-xl font-bold">
          {property.area} m²
          </p>
        </div>

        <div>
          <h3 className="text-gray-500 font-medium">Bedrooms</h3>
          <p className="text-xl font-bold">{property.bedrooms}</p>
        </div>

        <div>
          <h3 className="text-gray-500 font-medium">Bathrooms</h3>
          <p className="text-xl font-bold">{property.bathrooms}</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-6">
        <h3 className="text-gray-500 font-medium mb-2">Features</h3>
        <div className="grid grid-cols-2 gap-2">
          {property.features.map((feature) => (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View Details Button */}
      <button
        onClick={handleViewDetailsClick}
        className="w-full py-3 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors"
      >
        View Property Details
      </button>
    </div>
  );
};

export default PropertyDetails;
