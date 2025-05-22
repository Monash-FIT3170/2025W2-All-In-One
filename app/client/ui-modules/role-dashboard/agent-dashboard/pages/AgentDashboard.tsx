import React, { useEffect, useState } from "react";
import { UpcomingTasks } from "../../components/UpcomingTask";
import { PropertyOverview } from "../components/PropertyOverview";
import { DashboardCards } from "../components/DashboardCard";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  selectTasks,
  setTasks,
} from "../state/agent-dashboard-slice";
import { RoleSideNavBar } from "../../../navigation-bars/side-nav-bars/SideNavbar";
import { AgentTopNavbar } from "../../../navigation-bars/TopNavbar";
import {
  agentDashboardLinks,
  settingLinks,
} from "../../../navigation-bars/side-nav-bars/side-nav-link-definitions";

export function AgentDashboard(): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);

  return (
    <div className="min-h-screen">
      <AgentTopNavbar onSideBarOpened={onSideBarOpened} />
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
            <UpcomingTasks tasks={tasks} />
            <PropertyOverview />
          </div>
        </div>
      </div>
    </div>
  );
}
