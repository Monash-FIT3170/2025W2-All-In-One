import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../theming-shadcn/Button";
import { CardWidget } from "../../../common/CardWidget";
import { PropertyWithListingDataAndNames } from "../state/landlord-properties-slice";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { NavigationPath } from "/app/client/navigation";
import { ViewAllButton } from "../../components/ViewAllButton";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../../../theming-shadcn/Popover";

interface PropertyOverviewProps {
  properties: PropertyWithListingDataAndNames[];
}

export function MyProperties({
  properties,
}: PropertyOverviewProps): React.JSX.Element {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<PropertyStatus | null>(null);

  const filteredProperties = filterStatus
    ? properties.filter((property) => property.propertyStatus === filterStatus)
    : properties;

  const handleViewAllProperties = () => {
    navigate(NavigationPath.LandlordProperties);
  };

  const handlePropertyClick = (property: PropertyWithListingDataAndNames) => {
    const url = `${NavigationPath.LandlordPropertyDetail}?propertyId=${property.propertyId}`;
    navigate(url, {
      state: { property }
    });
  };
  return (
    <CardWidget
      title="My Properties"
      value=""
      subtitle="Overview of your investment properties"
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
                  Rent/week
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProperties.map((property, index) => (
                <tr
                  key={index}
                  className="transition-colors hover:bg-gray-50"
                  onClick={() => handlePropertyClick(property)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handlePropertyClick(property)
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
      </div>
      <div className="mt-4">
        <ViewAllButton onClick={handleViewAllProperties}>
          View All Properties
        </ViewAllButton>
      </div>
    </CardWidget>
  );
}
