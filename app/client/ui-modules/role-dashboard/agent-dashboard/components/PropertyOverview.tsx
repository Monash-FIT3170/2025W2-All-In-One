import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../theming-shadcn/Popover";
import { CardWidget } from "../../../common/CardWidget";
import { ViewAllButton } from "../../components/ViewAllButton";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { PropertyWithListingData } from "../../../../library-modules/use-cases/property-listing/models/PropertyWithListingData";
import { useNavigate } from "react-router";
import { NavigationPath } from "../../../../navigation";

interface PropertyOverviewProps {
  properties: Property[];
  isLoading?: boolean;
  error?: string | null;
}

export function PropertyOverview({
  properties,
  isLoading = true,
  error = null,
}: PropertyOverviewProps): React.JSX.Element {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<PropertyStatus | null>(null);
  // const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProperties = filterStatus
    ? properties.filter((property) => property.propertyStatus === filterStatus)
    : properties;

  // Handler for the button click
  const handleViewAllClick = () => {
    navigate(NavigationPath.AgentProperties);
  };

  // Property click handler to navigate to property details
  const handlePropertyClick = (propertyId: string) => {
    if (propertyId) {
      navigate(
        `/property-listing?propertyId=${propertyId}&from=agent-dashboard`
      );
    }
  };

  return (
    <CardWidget
      title="Property Overview"
      value=""
      subtitle="Quick view of your managed properties"
      rightElement={
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
              <span>Filter {filterStatus && `(${filterStatus})`}</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={8} className="w-48 p-1">
            <div className="space-y-1">
              <button
                onClick={() => setFilterStatus(null)}
                className={`w-full text-left px-3 py-2 text-sm rounded ${
                  !filterStatus
                    ? "bg-blue-50 text-blue-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Statuses
              </button>
              {Object.values(PropertyStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`w-full text-left px-3 py-2 text-sm rounded ${
                    filterStatus === status
                      ? status === PropertyStatus.OCCUPIED
                        ? "bg-red-50 text-red-800"
                        : status === PropertyStatus.VACANT
                          ? "bg-green-50 text-green-800"
                          : status === PropertyStatus.UNDER_MAINTENANCE
                            ? "bg-yellow-50 text-yellow-800"
                            : "bg-blue-50 text-blue-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      }
    >
      <div className="mt-2">
        {isLoading ? (
          <div className="text-center py-4">Loading properties...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Rent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProperties.map((property, index) => (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-gray-50"
                    onClick={() => handlePropertyClick(property.propertyId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      handlePropertyClick(property.propertyId)
                    }
                    aria-label={`View property details for property at ${property.streetnumber} ${property.streetname}`}
                  >
                    <td className="px-6 py-4 text-sm">{`${property.streetnumber} ${property.streetname}`}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          property.propertyStatus === PropertyStatus.CLOSED
                            ? "bg-gray-100 text-gray-800"
                            : property.propertyStatus === PropertyStatus.DRAFT
                              ? "bg-purple-100 text-purple-800"
                              : property.propertyStatus ===
                                  PropertyStatus.LISTED
                                ? "bg-blue-100 text-blue-800"
                                : property.propertyStatus ===
                                    PropertyStatus.UNDER_MAINTENANCE
                                  ? "bg-yellow-100 text-yellow-800"
                                  : property.propertyStatus ===
                                      PropertyStatus.VACANT
                                    ? "bg-green-100 text-green-800"
                                    : property.propertyStatus ===
                                        PropertyStatus.OCCUPIED
                                      ? "bg-red-100 text-red-800"
                                      : "bg-grey-100 text-grey-800"
                        }`}
                      >
                        {property.propertyStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      ${property.pricePerMonth.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mt-4">
        <ViewAllButton onClick={handleViewAllClick}>
          View All Properties
        </ViewAllButton>
      </div>
    </CardWidget>
  );
}
