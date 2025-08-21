import React from 'react';
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";

interface PropertyCardProps {
  property: Property;
}

function PropertyCard({ property }: PropertyCardProps) {
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case PropertyStatus.OCCUPIED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case PropertyStatus.VACANT:
        return "bg-red-100 text-red-800 border-red-200";
      case PropertyStatus.UNDER_MAINTENANCE:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format address
  const fullAddress = `${property.streetnumber} ${property.streetname}`;
  const locationText = `${property.suburb}, ${property.province}`;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Property Image */}
      <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
        {/* Placeholder image - you can replace with actual property images */}
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-4a1 1 0 011-1h4a1 1 0 011 1v4m-5 0h10" />
          </svg>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(property.propertyStatus)}`}>
            {property.propertyStatus.toUpperCase()}
          </span>
        </div>
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