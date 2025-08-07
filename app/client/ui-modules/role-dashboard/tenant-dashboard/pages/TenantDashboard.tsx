import React from "react";
import { useEffect } from "react";
import { UpcomingTasks } from "/app/client/ui-modules/role-dashboard/components/UpcomingTask";
import PropertyDetails from "/app/client/ui-modules/role-dashboard/tenant-dashboard/components/PropertyDetails";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  fetchTenantTasks,
  fetchTenantProperty,
  selectTasks,
  selectPropertyDetails,
  selectPropertyLoading,
} from "../../tenant-dashboard/state/tenant-dashboard-slice";
import DashboardCards from "/app/client/ui-modules/role-dashboard/tenant-dashboard/components/DashboardCards";

function TenantDashboard() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const propertyDetails = useAppSelector(selectPropertyDetails);
  const propertyLoading = useAppSelector(selectPropertyLoading);
  const currentUser = useAppSelector((state) => state.currentUser.authUser);
  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchTenantTasks(currentUser.userId));
      dispatch(fetchTenantProperty(currentUser.userId));
    }
  }, [dispatch, currentUser?.userId]);

  // Transform API property data to match PropertyDetails component props
  const transformedPropertyDetails = React.useMemo(() => {
    if (!propertyDetails) return null;

    return {
      address: {
        street: `${propertyDetails.streetnumber} ${propertyDetails.streetname}`,
        city: propertyDetails.suburb,
        state: propertyDetails.province,
        zip: propertyDetails.postcode,
      },
      propertyType: propertyDetails.type,
      squareFootage: propertyDetails.area,
      bedrooms: propertyDetails.bedrooms,
      bathrooms: propertyDetails.bathrooms,
      features: propertyDetails.features.map((feature, index) => ({
        id: index.toString(),
        name: feature,
      })),
    };
  }, [propertyDetails]);

  return (
    <div className="flex flex-row min-h-screen">
      <div className="flex-1">
        <div className="flex">
          <div className="flex-1 p-6">
            <DashboardCards rentAmount={propertyDetails?.pricePerMonth} />
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
              <div className="mt-5">
                <UpcomingTasks tasks={tasks ?? []} currentUser={currentUser} />
              </div>
              <div className="mt-5">
                {propertyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : transformedPropertyDetails ? (
                  <PropertyDetails
                    {...transformedPropertyDetails}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    No property details available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenantDashboard;
