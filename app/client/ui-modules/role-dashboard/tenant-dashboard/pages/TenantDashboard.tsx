import React from "react";
import { useEffect } from "react";
import { UpcomingTasks } from "/app/client/ui-modules/role-dashboard/components/UpcomingTask";
import PaymentHistory from "/app/client/ui-modules/role-dashboard/tenant-dashboard/components/PaymentHistory";
import PropertyDetails from "/app/client/ui-modules/role-dashboard/tenant-dashboard/components/PropertyDetails";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  selectTasks,
  setTasks,
} from "../../tenant-dashboard/state/tenant-dashboard-slice";
import DashboardCards from "/app/client/ui-modules/role-dashboard/tenant-dashboard/components/DashboardCards";
import { TenantTopNavbar } from "../../../navigation-bars/TopNavbar";
import { RoleSideNavBar } from "../../../navigation-bars/side-nav-bars/SideNavbar";
import {
  tenantDashboardLinks,
  settingLinks,
} from "../../../navigation-bars/side-nav-bars/side-nav-link-definitions";
import { setLoading } from "../../agent-dashboard/state/agent-dashboard-slice";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

function TenantDashboard() {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const userTasks = useAppSelector(
    (state) => state.currentUser.currentUser?.tasks
  );

  console.log(currentUser);

  // Fetch user data when component mounts
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (!currentUser?.userAccountId) {
  //       const userId = Meteor.userId();
  //       if (!userId) return;

  //       try {
  //         // Fetch tenant-specific data only
  //         const tenantData = await Meteor.callAsync(
  //           MeteorMethodIdentifier.TENANT_GET,
  //           userId
  //         );
  //         console.log("Fetched Tenant Data:", tenantData);

  //         // Convert Date fields if needed
  //         const payload = {
  //           ...tenantData,
  //           createdAt:
  //             tenantData.createdAt && tenantData.createdAt instanceof Date
  //               ? tenantData.createdAt.toISOString()
  //               : tenantData.createdAt,
  //         };

  //         dispatch({
  //           type: "currentUser/setCurrentUser",
  //           payload,
  //         });
  //       } catch (error) {
  //         console.error("Error fetching tenant data:", error);
  //       }
  //     }
  //   };

  //   fetchUserData();
  // }, [dispatch]);

  // // Dummy data for upcoming tasks
  // useEffect(() => {
  //   dispatch(
  //     setTasks([
  //       {
  //         // id: "1",
  //         title: "Rent Payment Due",
  //         address: "123 Main St",
  //         datetime: "April 1, 2024",
  //         status: "Due Soon" as const,
  //       },
  //       {
  //         // id: "2",
  //         title: "Maintenance Inspection",
  //         address: "123 Main St",
  //         datetime: "Tomorrow, 10:00 AM",
  //         status: "Upcoming" as const,
  //       },
  //       {
  //         // id: "3",
  //         title: "Lease Renewal Discussion",
  //         address: "123 Main St",
  //         datetime: "Mar 28, 3:30 PM",
  //         status: "Upcoming" as const,
  //       },
  //     ])
  //   );
  // }, [dispatch]);

  // Dummy data for payment history
  const dummyPayments = [
    {
      id: "1",
      month: "March Rent",
      amount: 1500,
      paidOn: "Mar 1, 2025",
      status: "paid" as const,
    },
    {
      id: "2",
      month: "February Rent",
      amount: 1500,
      paidOn: "Feb 1, 2025",
      status: "paid" as const,
    },
    {
      id: "3",
      month: "January Rent",
      amount: 1500,
      paidOn: "Jan 1, 2025",
      status: "paid" as const,
    },
  ];

  // Dummy data for property details
  const dummyPropertyDetails = {
    // propertyImage: "/path/to/image.jpg", // Optional - will show placeholder if not provided
    address: {
      street: "123 Main St",
      apt: "4B",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    propertyType: "Apartment",
    squareFootage: 850,
    bedrooms: 2,
    bathrooms: 1,
    features: [
      { id: "1", name: "Air Conditioning" },
      { id: "2", name: "Dishwasher" },
      { id: "3", name: "Washer/Dryer" },
      { id: "4", name: "Hardwood Floors" },
    ],
  };

  return (
    <div className="flex flex-row min-h-screen">
      <div className="flex-1">
        <TenantTopNavbar onSideBarOpened={onSideBarOpened} />

        <div className="flex">
          <RoleSideNavBar
            isOpen={isSidebarOpen}
            onClose={() => onSideBarOpened(false)}
            dashboardLinks={tenantDashboardLinks}
            settingsLinks={settingLinks}
          />
          <div className="flex-1 p-6">
            <DashboardCards />
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
              <div className="mt-5">
                <UpcomingTasks taskIds={userTasks ?? []} />
              </div>

              <div className="mt-5">
                <PaymentHistory
                  payments={dummyPayments}
                  onViewAllClick={() =>
                    console.log("Navigate to payment history page")
                  }
                />
              </div>

              <div className="mt-5">
                <PropertyDetails
                  {...dummyPropertyDetails}
                  onViewDetailsClick={() =>
                    console.log("Navigate to property details page")
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenantDashboard;
