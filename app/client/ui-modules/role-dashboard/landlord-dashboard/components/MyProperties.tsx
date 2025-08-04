import React from "react";
import { Button } from "../../../theming-shadcn/Button";
import { CardWidget } from "../../components/CardWidget";

interface Property {
  address: string;
  status: "Occupied" | "Vacant"
  rent: number;
}

interface PropertyOverviewProps {
  properties: Property[];
  className?: string;
}

export function MyProperties({
  properties,
  className = "",
}: PropertyOverviewProps): React.JSX.Element {
  return (
    <CardWidget
      title="My Properties"
      value=""
      subtitle="Overview of your investment properties"
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
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rent/week</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.map((property, index) => (
                <tr key={index} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{property.address}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      property.status === "Occupied" ? "bg-red-100 text-red-800" :
                      property.status === "Vacant" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
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
      <Button variant="ghost" className="w-full py-3 border-transparent rounded-lg text-center hover:bg-gray-50 transition-colors">
        View All Properties
        </Button>
      </div>
    </CardWidget>
  );
}