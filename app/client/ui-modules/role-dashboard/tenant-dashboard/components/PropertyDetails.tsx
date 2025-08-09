// components/PropertyDetails.tsx
import React from "react";
import { useNavigate } from "react-router";
import { NavigationPath } from "/app/client/navigation";
import { Property } from "/app/client/library-modules/domain-models/property/Property";

interface PropertyDetailsProps {
  property: Property;
}

export function PropertyDetails({
  property  
}: PropertyDetailsProps): React.JSX.Element {
  const navigate = useNavigate();

  const handleViewDetailsClick = () => {
    navigate(NavigationPath.TenantProperty);
  };

  // Format the full property
  const fullPropertyAddress = [
    `${property.streetname}${property.type}`,
    `${property.suburb}, ${property.postcode} ${property.province}`,
  ];

  return (
    <div className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
      <h2 className="text-3xl font-bold mb-2">Property Details</h2>
      <p className="text-gray-600 mb-6">Your current residence</p>

      {/* Property Image */}
      <div className="bg-gray-100 rounded-lg mb-6 flex items-center justify-center h-64">
        <img
          src="https://images.unsplash.com/photo-1521783988139-89397d761dce?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Property"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* property Section */}
      <div className="mb-6">
        <h3 className="text-gray-500 font-medium mb-1">property</h3>
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
          {property.area}m^2`
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
