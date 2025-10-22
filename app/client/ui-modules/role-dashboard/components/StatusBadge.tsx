import React from 'react';
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";

interface StatusBadgeProps {
  status: PropertyStatus | ListingStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusBadgeClass = (status: PropertyStatus | ListingStatus) => {
    switch (status) {
      // PropertyStatus values
      case PropertyStatus.OCCUPIED:
        return "bg-red-100 text-red-800";
      case PropertyStatus.VACANT:
        return "bg-green-100 text-green-800";
      
      // ListingStatus values
      case ListingStatus.DRAFT:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case ListingStatus.LISTED:
        return "bg-green-100 text-green-800 border-green-200";
      case ListingStatus.TENANT_APPROVAL:
        return "bg-orange-100 text-orange-800 border-orange-200";
      
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(status)} ${className}`}>
      {status.toUpperCase()}
    </span>
  );
} 