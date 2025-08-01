// components/PropertyDetails.tsx
import React from "react";
import { useNavigate } from "react-router";
import { NavigationPath } from "/app/client/navigation";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

interface PropertyFeature {
  id: string;
  name: string;
}

interface PropertyDetailsProps {
  propertyImage?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    apt?: string;
  };
  propertyType: string;
  squareFootage?: number;
  bedrooms: number;
  bathrooms: number;
  features: PropertyFeature[];
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  propertyImage,
  address,
  propertyType,
  squareFootage,
  bedrooms,
  bathrooms,
  features,
}) => {
  const navigate = useNavigate();

  const handleViewDetailsClick = () => {
    navigate(NavigationPath.TenantProperty);
  };

  // Format the full address
  const fullAddress = [
    `${address.street}${address.apt ? `, Apt ${address.apt}` : ""}`,
    `${address.city}, ${address.state} ${address.zip}`,
  ];

  return (
    <div className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
      <h2 className="text-3xl font-bold mb-2">Property Details</h2>
      <p className="text-gray-600 mb-6">Your current residence</p>

      {/* Property Image */}
      <div className="bg-gray-100 rounded-lg mb-6 flex items-center justify-center h-64">
        {/* {propertyImage ? (
          <img
            src={propertyImage}
            alt="Property"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="text-gray-400 flex items-center justify-center h-full w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        )} */}
        <img
          src="https://images.unsplash.com/photo-1521783988139-89397d761dce?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Property"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Address Section */}
      <div className="mb-6">
        <h3 className="text-gray-500 font-medium mb-1">Address</h3>
        <p className="text-xl font-bold">{fullAddress[0]}</p>
        <p className="text-xl">{fullAddress[1]}</p>
      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
        <div>
          <h3 className="text-gray-500 font-medium">Property Type</h3>
          <p className="text-xl font-bold">{propertyType}</p>
        </div>

        <div>
          <h3 className="text-gray-500 font-medium">Square Footage</h3>
          <p className="text-xl font-bold">
            {squareFootage ? `${squareFootage} sq ft` : "N/A"}
          </p>
        </div>

        <div>
          <h3 className="text-gray-500 font-medium">Bedrooms</h3>
          <p className="text-xl font-bold">{bedrooms}</p>
        </div>

        <div>
          <h3 className="text-gray-500 font-medium">Bathrooms</h3>
          <p className="text-xl font-bold">{bathrooms}</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-6">
        <h3 className="text-gray-500 font-medium mb-2">Features</h3>
        <div className="grid grid-cols-2 gap-2">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>{feature.name}</span>
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
