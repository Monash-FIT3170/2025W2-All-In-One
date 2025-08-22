import React from 'react';
import { useNavigate } from 'react-router';
import { PropertyWithImages } from "../landlord-dashboard/state/landlord-dashboard-slice";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { NavigationPath } from "/app/client/navigation";
import { StatusBadge } from "../landlord-dashboard/components/StatusBadge";

interface PropertyCardProps {
  property: PropertyWithImages;
}


function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();

  // Format address
  const fullAddress = `${property.streetnumber} ${property.streetname}`;
  const locationText = `${property.suburb}, ${property.province}`;

  // Get the first image URL or use placeholder
  const displayImageUrl = property.imageUrls?.[0];

  // Handle click to navigate to property detail
  const handleClick = () => {
    navigate(`${NavigationPath.LandlordPropertyDetail}?propertyId=${property.propertyId}`);
  };

  console.log(property.propertyStatus);

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      {/* Property Image */}
      <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
        {displayImageUrl ? (
          <img
            src={displayImageUrl}
            alt={`Property at ${fullAddress}`}
            className="w-full h-full object-cover"
          />
        ) : (
          // Fallback placeholder when no image is available
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-4a1 1 0 011-1h4a1 1 0 011 1v4m-5 0h10" />
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={property.propertyStatus as PropertyStatus} />
        </div>

        {/* Image counter - show if there are multiple images */}
        {property.imageUrls && property.imageUrls.length > 1 && (
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-black bg-opacity-70 text-white">
              1/{property.imageUrls.length}
            </span>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        {/* Address */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{fullAddress}</h3>
          <p className="text-sm text-gray-600">{locationText}</p>
          <p className="text-xs text-gray-500">{property.type}</p>
        </div>

        {/* Property Features */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="font-medium">Bathrooms</span>
              <span className="ml-1">{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">Bedrooms</span>
              <span className="ml-1">{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">Parking</span>
              <span className="ml-1">{property.parking}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ${property.pricePerMonth.toLocaleString()}/month
            </span>
          </div>
        </div>

        {/* Area if available */}
        {property.area && (
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              Area: {property.area}m²
            </span>
          </div>
        )}

        {/* Features preview */}
        {property.features && property.features.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {property.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                  +{property.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyCard;