import React, { useEffect } from "react";
import { Button } from "../../../theming-shadcn/Button";
import { CardWidget } from "../../components/CardWidget";
import { useAppSelector, useAppDispatch } from "../../../../store";
import {selectAgentProperties, selectPropertiesLoading, selectPropertiesError, fetchAgentProperties } from "../state/agent-dashboard-slice";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { Property } from '/app/client/library-modules/domain-models/property/Property';

interface PropertyOverviewProps {
  className?: string;
}

export function PropertyOverview({
  className = "",
}: PropertyOverviewProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const properties = useAppSelector(selectAgentProperties);
  const isLoading = useAppSelector(selectPropertiesLoading);
  const error = useAppSelector(selectPropertiesError);

  useEffect(() => {
    if (currentUser && 'agentId' in currentUser && currentUser.agentId) {
      dispatch(fetchAgentProperties(currentUser.agentId));
    }
  }, [currentUser, dispatch]);

  const mappedProperties: Property[] = properties.map((property) => ({ ...property }));

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
                    <td className="px-6 py-4 text-sm">{`${property.streetnumber} ${property.streetname}`}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.propertyStatus === PropertyStatus.CLOSED ? "bg-gray-100 text-gray-800" :
                        property.propertyStatus === PropertyStatus.DRAFT ? "bg-purple-100 text-purple-800" :
                        property.propertyStatus === PropertyStatus.LISTED ? "bg-blue-100 text-blue-800" :
                        property.propertyStatus === PropertyStatus.UNDER_MAINTENANCE ? "bg-yellow-100 text-yellow-800" :
                        property.propertyStatus === PropertyStatus.VACANT ? "bg-red-100 text-red-800" :
                        property.propertyStatus === PropertyStatus.OCCUPIED ? "bg-green-100 text-green-800" :
                        "bg-grey-100 text-grey-800"
                      }`}>
                        {property.propertyStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">${property.pricePerMonth.toLocaleString()}</td>
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