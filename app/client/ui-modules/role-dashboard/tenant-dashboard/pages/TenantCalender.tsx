import React from "react";
import { TenantTopNavbar } from "../../../navigation-bars/TopNavbar";
import { RoleSideNavBar } from "../../../navigation-bars/side-nav-bars/SideNavbar";
import {
  settingLinks,
  tenantDashboardLinks,
} from "../../../navigation-bars/side-nav-bars/side-nav-link-definitions";

function TenantCalender() {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);
  return (
    <div className="min-h-screen">
      <TenantTopNavbar onSideBarOpened={onSideBarOpened} />
      <div className="flex">
        <RoleSideNavBar
          isOpen={isSidebarOpen}
          onClose={() => onSideBarOpened(false)}
          dashboardLinks={tenantDashboardLinks}
          settingsLinks={settingLinks}
        />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Tenant Calender</h1>
        </div>
      </div>
    </div>
  );
}

export default TenantCalender;
