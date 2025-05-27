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
import { RoleSideNavBar } from "../../../navigation-bars/side-nav-bars/SideNavbar";
import { RoleTopNavbar } from "../../../navigation-bars/TopNavbar";
import {
  agentDashboardLinks,
  settingLinks,
} from "../../../navigation-bars/side-nav-bars/side-nav-link-definitions";
import { setProperties } from "../../landlord-dashboard/state/landlord-dashboard-slice";

export function AgentDashboard(): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false); // is used to manage the state of the sidebar (open or closed).
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

    // dispatch(
    //   setTasks([
    //     {
    //       title: "Property Inspection",
    //       address: "123 Main St, Apt 4B",
    //       datetime: "May 1, 2024",
    //       status: "Due Soon" as const,
    //     },
    //     {
    //       title: "Tenant Meeting",
    //       address: "123 Main St, Apt 4B",
    //       datetime: "April 25, 2024",
    //       status: "Upcoming" as const,
    //     },
    //   ])
    // );
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <RoleTopNavbar onSideBarOpened={onSideBarOpened} />
      <div className="flex">
        <RoleSideNavBar
          isOpen={isSidebarOpen}
          onClose={() => onSideBarOpened(false)}
          dashboardLinks={agentDashboardLinks}
          settingsLinks={settingLinks}
        />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Agent Dashboard</h1>
          <DashboardCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingTasks tasks={tasks} /> <PropertyOverview />
          </div>
        </div>
      </div>
    </div>
  );
}
