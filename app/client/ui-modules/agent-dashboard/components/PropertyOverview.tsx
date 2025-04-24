import React from "react";

interface Property {
  address: string;
  status: "Closed" | "Maintenance" | "Draft" | "Listed"
  rent: number;
}

interface PropertyOverviewProps {
  properties: Property[];
  className?: string;
}

export function PropertyOverview({
  properties,
  className = "",
}: PropertyOverviewProps): React.JSX.Element {
  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Property Overview</h2>
          <p className="text-sm text-gray-500">Quick view of your managed properties</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
          <span>Filter</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Address</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {properties.map((property, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{property.address}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    property.status === "Closed" ? "bg-gray-100 text-gray-800" :
                    property.status === "Draft" ? "bg-yellow-100 text-yellow-800" :
                    property.status === "Listed" ? "bg-green-100 text-green-800" :
                    property.status === "Maintenance" ? "bg-blue-100 text-blue-800" :
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

      <button className="w-full mt-4 py-2 text-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg">
        View All Properties
      </button>
    </div>
  );
}