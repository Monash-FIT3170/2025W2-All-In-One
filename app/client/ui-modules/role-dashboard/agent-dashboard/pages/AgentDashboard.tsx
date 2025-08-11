import React, { useEffect } from "react";
import { UpcomingTasks } from "../../components/UpcomingTask";
import { PropertyOverview } from "../components/PropertyOverview";
import { DashboardCards } from "../components/DashboardCard";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  fetchAgentDetails,
  selectError,
  selectIsLoading,
  selectProperties,
  selectTasks,
} from "../state/agent-dashboard-slice";

export function AgentDashboard(): React.JSX.Element {
  const dispatch = useAppDispatch(); // is used to dispatch actions to the Redux store.
  const properties = useAppSelector(selectProperties); // is used to retrieve data from the Redux store.
  const tasks = useAppSelector(selectTasks);
  const currentUser = useAppSelector((state) => state.currentUser.authUser);
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchAgentDetails(currentUser.userId));
    }
    else {
      console.warn("No user ID found. Please log in to view the dashboard.");
    }
  }, []);

  return (
    <div className="min-h-screen">
      <div className="flex">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Agent Dashboard</h1>
          <DashboardCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingTasks tasks={tasks} currentUser={currentUser} /> <PropertyOverview properties={properties} error={error} isLoading={isLoading}/>
          </div>
        </div>
      </div>
    </div>
  );
}
