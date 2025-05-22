import React, { useEffect, useState } from "react";
import { Button } from "../../../theming-shadcn/Button";
import { CardWidget } from "../../components/CardWidget";
import { useAppSelector } from "../../../../store";
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';
import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";

interface Property {
  address: string;
  status: "Closed" | "Under Maintenance" | "Draft" | "Listed" | "Vacant" | "Occupied"
  rent: number;
}

interface PropertyOverviewProps {
  className?: string;
}

export function PropertyOverview({
  className = "",
}: PropertyOverviewProps): React.JSX.Element {
  const [properties, setProperties] = useState<Property[]>([]);
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);

  useEffect(() => {
    const getPropertyList = async () => {
      if (currentUser && 'agentId' in currentUser && currentUser.agentId) {
        try {
          const apiProperties = await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET_LIST, currentUser.agentId) as ApiProperty[];
          const mappedProperties: Property[] = apiProperties.map((property: ApiProperty) => ({
            address: `${property.streetnumber} ${property.streetname}`,
            status: property.propertyStatus as "Closed" | "Under Maintenance" | "Draft" | "Listed" | "Vacant" | "Occupied",
            rent: property.pricePerMonth,
          }));
          setProperties(mappedProperties);
        } catch (error) {
          setProperties([]);
          console.error('Error fetching properties:', error);
        }
      }
    };

    getPropertyList();
  }, [currentUser]);

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
              {properties.map((property, index) => (
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
      </div>

      <div className="mt-4">
        <Button variant="ghost" className="w-full">
          View All Properties
        </Button>
      </div>
    </CardWidget>
  );
}