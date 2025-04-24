import React, { useEffect } from "react";
import { UpcomingTasks } from "../components/UpcomingTasks";
import { PropertyOverview } from "../components/PropertyOverview";
import { DashboardCard } from "../components/DashboardCard";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectProperties, selectTasks, setProperties, setTasks } from "../state/agent-dashboard-slice";

export function AgentDashboard(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const properties = useAppSelector(selectProperties);
  const tasks = useAppSelector(selectTasks);

  useEffect(() => {
    // Dummy data to be replaced with API calls
    dispatch(setProperties([
      {
        address: "123 Main St",
        status: "Closed",
        rent: 1500,
      },
      {
        address: "456 Oak Ave",
        status: "Draft",
        rent: 2200,
      },
      {
        address: "789 Pine Rd",
        status: "Closed",
        rent: 1800,
      },
      {
        address: "101 Cedar Ln",
        status: "Maintenance",
        rent: 1950,
      },
    ]));

    dispatch(setTasks([
      {
        title: "Property Inspection",
        address: "123 Main St, Apt 4B",
        datetime: "May 1, 2024",
        status: "Due Soon" as const,
      },
      {
        title: "Tenant Meeting",
        address: "123 Main St, Apt 4B",
        datetime: "April 25, 2024",
        status: "Upcoming" as const,
      },
    ]));
  }, [dispatch]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Agent Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Total Properties"
          value= "12"
          subtitle="+2 from last month"
        />
        <DashboardCard
          title="Occupancy Rate"
          value="85%"
        />
        <DashboardCard
          title="Pending Tasks"
          value="7"
          subtitle="5 due this week"
        />
        <DashboardCard
          title = "Monthly Revenue"
          value = "$24,500"
          subtitle = "+5% from last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTasks tasks={tasks} />
        <PropertyOverview properties={properties} />
      </div>
    </div>
  );
}