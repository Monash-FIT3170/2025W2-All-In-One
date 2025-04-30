import React from "react";
import { LandlordDashboardCards }  from "../components/LandlordDashboardCard"

export function LandlordDashboard(): React.JSX.Element {
  const sampleProperties = [
    {
      address: "42 Bondi Road",
      status: "Occupied" as const,
      rent: "$650/week",
    },
    {
      address: "15 Chapel Street",
      status: "Vacant" as const,
      rent: "$720/week",
    },
    {
      address: "78 Brunswick Street",
      status: "Occupied" as const,
      rent: "$480/week",
    },
  ];

  const sampleTasks = [
    {
      title: "Potential Tenant Selectian (Final)",
      address: "42 Bondi Road",
      datetime: "May 1, 2024",
      status: "Upcoming" as const,
    },
    {
      title: "Lease Renewal Discussion",
      address: "78 Brunswick Street",
      datetime: "May 15, 2024",
      status: "Pending" as const,
    },
    {
      title: "Agent Meeting - New Property Listing",
      address: "15 Chapel Street",
      datetime: "May 18, 2024",
      status: "Upcoming" as const,
    },
    {
      title: "Review Rental Increase",
      address: "42 Bondi Road",
      datetime: "May 22, 2024",
      status: "Pending" as const,
    },
  ];

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6">Landlord Dashboard</h1>
      <LandlordDashboardCards/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      </div>
    </div>
  );
}
