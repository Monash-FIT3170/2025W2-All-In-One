import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";

import { LandlordDashboardCards } from "../components/LandlordDashboardCard";
import { UpcomingTasks } from "../../components/UpcomingTask";
import { MyProperties } from "../components/MyProperties";
import {
  selectTasks,
  setTasks,
  selectProperties,
  setProperties,
} from "../state/landlord-dashboard-slice";

import { RoleSideNavBar } from "../../../navigation-bars/side-nav-bars/SideNavbar";
import { LandlordTopNavbar } from "../../../navigation-bars/TopNavbar";
import {
  landlordDashboardLinks,
  settingLinks,
} from "../../../navigation-bars/side-nav-bars/side-nav-link-definitions";

export function LandlordDashboard(): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const properties = useAppSelector(selectProperties);

  useEffect(() => {
    dispatch(
      setTasks([
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
          status: "Due Soon" as const,
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
          status: "Due Soon" as const,
        },
      ])
    );
    dispatch(
      setProperties([
        {
          address: "42 Bondi Road",
          status: "Occupied" as const,
          rent: 650,
        },
        {
          address: "15 Chapel Street",
          status: "Vacant" as const,
          rent: 720,
        },
        {
          address: "78 Brunswick Street",
          status: "Occupied" as const,
          rent: 480,
        },
      ])
    );
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <LandlordTopNavbar onSideBarOpened={onSideBarOpened} />
      <div className="flex">
        <RoleSideNavBar
          isOpen={isSidebarOpen}
          onClose={() => onSideBarOpened(false)}
          dashboardLinks={landlordDashboardLinks}
          settingsLinks={settingLinks}
        />
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
