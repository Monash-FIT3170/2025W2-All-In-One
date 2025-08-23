import React from "react";
import { useEffect } from "react";
import { UpcomingTasks } from "/app/client/ui-modules/role-dashboard/components/UpcomingTask";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  selectTasks,
  selectPropertyDetails,
  fetchTenantDetails,
} from "../state/reducers/tenant-dashboard-slice";
import DashboardCards from "/app/client/ui-modules/role-dashboard/tenant-dashboard/components/TenantDashboardCard";
import PropertyDetails from "../components/PropertyDetails";

function TenantDashboard() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const property = useAppSelector(selectPropertyDetails);
  const currentUser = useAppSelector((state) => state.currentUser.authUser);
  const isLoading = useAppSelector((state) => state.tenantDashboard.isLoading);

  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchTenantDetails(currentUser.userId));
    }
  }, [dispatch, currentUser?.userId]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (property) {
    return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row min-h-screen">
        <div className="flex-1">
          <div className="flex">
            <div className="flex-1 p-6">
              <DashboardCards rentAmount={property?.pricePerMonth} />
              <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
                <div className="mt-5">
                  <UpcomingTasks tasks={tasks} />
                </div>
                <div className="mt-5">
                  <PropertyDetails property={property}></PropertyDetails> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
  )}
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">No Property Found</h1>
      <p className="text-gray-600">Please contact your landlord or agent for more information.</p>
    </div>
  );
}

export default TenantDashboard;
