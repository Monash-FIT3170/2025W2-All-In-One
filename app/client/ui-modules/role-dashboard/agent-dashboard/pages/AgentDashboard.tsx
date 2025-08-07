import React, { useEffect } from "react";
import { UpcomingTasks } from "../../components/UpcomingTask";
import { PropertyOverview } from "../components/PropertyOverview";
import { DashboardCards } from "../components/DashboardCard";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  fetchAgentTasks,
  selectProperties,
  selectTasks,
} from "../state/agent-dashboard-slice";
import { setProperties } from "../../landlord-dashboard/state/landlord-dashboard-slice";

export function AgentDashboard(): React.JSX.Element {
  const dispatch = useAppDispatch(); // is used to dispatch actions to the Redux store.
  const properties = useAppSelector(selectProperties); // is used to retrieve data from the Redux store.
  const tasks = useAppSelector(selectTasks);
  const currentUser = useAppSelector((state) => state.currentUser.authUser);

  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchAgentTasks(currentUser.userId));
    }
  }, [dispatch, currentUser?.userId]);
  useEffect(() => {
    // Dummy data to be replaced with API calls
    // This useEffect hook is used to set the initial state of properties and tasks when the component mounts.
    dispatch(
      setProperties([
        {
          address: "123 Main St",
          status: "Occupied",
          rent: 1500,
        },
        {
          address: "456 Oak Ave",
          status: "Vacant",
          rent: 2200,
        },
        {
          address: "789 Pine Rd",
          status: "Vacant",
          rent: 1800,
        },
        {
          address: "101 Cedar Ln",
          status: "Occupied",
          rent: 1950,
        },
      ])
    );

  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <div className="flex">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Agent Dashboard</h1>
          <DashboardCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingTasks tasks={tasks} currentUser ={currentUser} /> <PropertyOverview />
          </div>
        </div>
      </div>
    </div>
  );
}
