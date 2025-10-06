import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../theming-shadcn/Button";
import { CardWidget } from "../../../common/CardWidget";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { NavigationPath } from "/app/client/navigation";
import { ViewAllButton } from "../../components/ViewAllButton";

interface PropertyOverviewProps {
  properties: Property[];
}

export function MyProperties({
  properties,
}: PropertyOverviewProps): React.JSX.Element {
  const navigate = useNavigate();

  const handleViewAllProperties = () => {
    navigate(NavigationPath.LandlordProperties);
  };
  return (
    <CardWidget
      title="My Properties"
      value=""
      subtitle="Overview of your investment properties"
      rightElement={
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
          <span>Filter</span>
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
              {properties.map((property, index) => (
                <tr key={index} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{`${property.streetnumber} ${property.streetname}`}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.propertyStatus === PropertyStatus.OCCUPIED
                          ? "bg-red-100 text-red-800"
                          : property.propertyStatus === PropertyStatus.VACANT
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
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
