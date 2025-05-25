import React, { useEffect } from "react";
import { Button } from "../../../theming-shadcn/Button";
import { CardWidget } from "../../components/CardWidget";
import { useAppSelector, useAppDispatch } from "../../../../store";
import { loadPropertyList, selectPropertyList, selectPropertyListLoading, selectPropertyListError } from "../../../property-listing-page/state/reducers/property-listing-slice";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";

interface Property {
  address: string;
  status: PropertyStatus;
  rent: number;
}

interface PropertyOverviewProps {
  className?: string;
}

export function PropertyOverview({
  className = "",
}: PropertyOverviewProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const properties = useAppSelector(selectPropertyList);
  const isLoading = useAppSelector(selectPropertyListLoading);
  const error = useAppSelector(selectPropertyListError);

  useEffect(() => {
    if (currentUser && 'agentId' in currentUser && currentUser.agentId) {
      dispatch(loadPropertyList(currentUser.agentId));
    }
  }, [currentUser, dispatch]);

  const mappedProperties: Property[] = properties.map((property) => ({
    address: `${property.streetnumber} ${property.streetname}`,
    status: property.propertyStatus as PropertyStatus,
    rent: property.pricePerMonth,
  }));

  return (
    <CardWidget
      title="Property Overview"
      value=""
      subtitle="Quick view of your managed properties"
      className={className}
      rightElement={
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
          <span>Filter</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
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
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Address</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mappedProperties.map((property, index) => (
                  <tr key={index} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{property.address}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.status === "Closed" ? "bg-gray-100 text-gray-800" :
                        property.status === "Draft" ? "bg-purple-100 text-purple-800" :
                        property.status === "Listed" ? "bg-blue-100 text-blue-800" :
                        property.status === "Under Maintenance" ? "bg-yellow-100 text-yellow-800" :
                        property.status === "Vacant" ? "bg-red-100 text-red-800":
                        property.status === "Occupied" ? "bg-green-100 text-green-800":
                        "bg-grey-100 text-grey-800"
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">${property.rent.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Button variant="ghost" className="w-full">
          View All Properties
        </Button>
      </div>
    </CardWidget>
  );
}