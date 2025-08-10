import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";

import { LandlordDashboardCards } from "../components/LandlordDashboardCard";
import { UpcomingTasks } from "../../components/UpcomingTask";
import { MyProperties } from "../components/MyProperties";
import {
  selectTasks,
  selectProperties,
  fetchLandlordDetails,
} from "../state/landlord-dashboard-slice";

export function LandlordDashboard(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const properties = useAppSelector(selectProperties);
  const tasks = useAppSelector(selectTasks);
  const currentUser = useAppSelector((state) => state.currentUser.authUser);

  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchLandlordDetails(currentUser.userId));
    }
    else{
      console.warn("No user ID found. Please log in to view the dashboard.");
    }
  }, []);

  return (
    <div className="min-h-screen">
      <div className="flex">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Landlord Dashboard</h1>
          <LandlordDashboardCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MyProperties properties={properties} />
            <UpcomingTasks tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
}
