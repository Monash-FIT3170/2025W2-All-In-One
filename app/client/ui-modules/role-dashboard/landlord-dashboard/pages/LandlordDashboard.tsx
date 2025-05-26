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
  fetchLandlordTasks,
} from "../state/landlord-dashboard-slice";

import { RoleSideNavBar } from "../../../navigation-bars/side-nav-bars/SideNavbar";
import { RoleTopNavbar } from "../../../navigation-bars/TopNavbar";
import {
  landlordDashboardLinks,
  settingLinks,
} from "../../../navigation-bars/side-nav-bars/side-nav-link-definitions";

export function LandlordDashboard(): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);
  const dispatch = useAppDispatch();
  const properties = useAppSelector(selectProperties);

  const tasks = useAppSelector(selectTasks);
  const currentUser = useAppSelector((state) => state.currentUser.authUser);

  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchLandlordTasks(currentUser.userId));
    }
  }, [dispatch, currentUser?.userId]);

  useEffect(() => {
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
      <RoleTopNavbar onSideBarOpened={onSideBarOpened} />
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
