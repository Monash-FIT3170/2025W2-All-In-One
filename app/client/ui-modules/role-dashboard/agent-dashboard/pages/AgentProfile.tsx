import React from "react";
import { AgentTopNavbar } from "../../../navigation-bars/TopNavbar";
import { RoleSideNavBar } from "../../../navigation-bars/side-nav-bars/SideNavbar";
import { agentDashboardLinks, settingLinks } from "../../../navigation-bars/side-nav-bars/side-nav-link-definitions";
import { ProfileCard } from "../components/ProfileCard";

export function AgentProfile(): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);

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
          <h1 className="text-2xl font-bold mb-6">Agent Profile</h1>
          <ProfileCard/>
        </div>
      </div>
    </div>
  );
}