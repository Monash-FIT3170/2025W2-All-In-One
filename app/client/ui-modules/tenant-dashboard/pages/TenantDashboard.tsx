import React, { useEffect } from "react";
import { UpcomingTasks } from "../components/UpcomingTasks";
import { PropertyDetails } from "../components/PropertyDetails";
import { DashboardCard } from "../components/DashboardCard";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectPropertyDetails, selectTasks, setPropertyDetails, setTasks } from "../state/tenant-dashboard-slice";

export function TenantDashboard(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const propertyDetails = useAppSelector(selectPropertyDetails);
  const tasks = useAppSelector(selectTasks);

  useEffect(() => {
    // Dummy data to be replaced with API calls
    dispatch(setPropertyDetails({
      propertyManager: {
        name: "Bob Builder",
        email: "bob.builder@example.com",
        initials: "BB",
      },
      leaseTerm: {
        startDate: "Jan 1, 2024",
        endDate: "Dec 31, 2024",
        monthsLeft: 8,
      },
      address: {
        street: "123 Main Street",
        city: "Melbourne",
        state: "VIC",
        zip: "12345",
      },
      rent: {
        amount: 2000,
        dueDate: "1st",
      },
    }));

    dispatch(setTasks([
      {
        title: "Rent Payment Due",
        address: "123 Main St, Apt 4B",
        datetime: "May 1, 2024",
        status: "Due Soon" as const,
      },
      {
        title: "Maintenance Request",
        address: "123 Main St, Apt 4B",
        datetime: "April 25, 2024",
        status: "Upcoming" as const,
      },
    ]));
  }, [dispatch]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tenant Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Next Rent Due"
          value="$2,000"
          subtitle="Due in 5 days"
        />
        <DashboardCard
          title="Lease Duration"
          value="8 months"
          subtitle="Remaining"
        />
        <DashboardCard
          title="Maintenance Requests"
          value="2"
          subtitle="Active"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {propertyDetails && <PropertyDetails {...propertyDetails} />}
        <UpcomingTasks tasks={tasks} />
      </div>
    </div>
  );
}