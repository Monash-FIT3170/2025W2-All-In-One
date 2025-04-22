import React from "react";

interface PropertyDetailsProps {
  propertyManager: {
    name: string;
    email: string;
    initials: string;
  };
  leaseTerm: {
    startDate: string;
    endDate: string;
    monthsLeft: number;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  rent: {
    amount: number;
    dueDate: string;
  };
  className?: string;
}

export function PropertyDetails({
  propertyManager,
  leaseTerm,
  address,
  rent,
  className = "",
}: PropertyDetailsProps): React.JSX.Element {
  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-6">Property Details</h2>

      <div className="space-y-6">
        <section>
          <h3 className="text-gray-600 mb-2">Property Manager</h3>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <span className="text-sm font-medium">{propertyManager.initials}</span>
            </div>
            <div>
              <p className="font-medium">{propertyManager.name}</p>
              <p className="text-sm text-gray-500">{propertyManager.email}</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-gray-600 mb-2">Lease Term</h3>
          <p className="font-medium">{`${leaseTerm.startDate} - ${leaseTerm.endDate}`}</p>
          <div className="flex items-center mt-1">
            <p className="text-sm">{`${leaseTerm.monthsLeft} months left`}</p>
            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
              Active Lease
            </span>
          </div>
        </section>

        <section>
          <h3 className="text-gray-600 mb-2">Address</h3>
          <p className="font-medium">{address.street}</p>
          <p className="text-sm text-gray-500">{`${address.city}, ${address.state} ${address.zip}`}</p>
        </section>

        <section>
          <h3 className="text-gray-600 mb-2">Monthly Rent</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">${rent.amount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{`Due on the ${rent.dueDate}`}</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            View Payment History
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}