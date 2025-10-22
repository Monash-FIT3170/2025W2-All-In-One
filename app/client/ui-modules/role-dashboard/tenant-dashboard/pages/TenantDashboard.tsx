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
import { fetchTenantPropertyWithListingData } from "../state/reducers/tenant-property-slice";

function TenantDashboard() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const property = useAppSelector(selectPropertyDetails);
  const listingImages = useAppSelector((state) => state.tenantProperty.listingImageUrls);
  const currentUser = useAppSelector((state) => state.currentUser.authUser);
  const isLoading = useAppSelector((state) => state.tenantDashboard.isLoading);

  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchTenantDetails(currentUser.userId));
      dispatch(fetchTenantPropertyWithListingData());
    }
  }, [dispatch, currentUser?.userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full border-b-2 border-blue-600 h-16 w-16 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row min-h-screen">
        <div className="flex-1">
          <div className="flex">
            <div className="flex-1 p-6">
              <DashboardCards rentAmount={property?.pricePerMonth} tasks={tasks} />
              <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
                <div className="mt-5">
                  <UpcomingTasks tasks={tasks} currentUser={currentUser} />
                </div>
                <div className="flex-1">
                  <PropertyDetails property={property} listing={listingImages}></PropertyDetails>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenantDashboard;
