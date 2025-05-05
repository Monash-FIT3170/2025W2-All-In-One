import React from "react";
import { RoleSideNavBar } from "../../../navigation-bars/side-nav-bars/SideNavbar";
import { LandlordTopNavbar } from "../../../navigation-bars/TopNavbar";
import {
  landlordDashboardLinks,
  settingLinks,
} from "../../../navigation-bars/side-nav-bars/side-nav-link-definitions";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export function LandlordCalendar(): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);
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
          <h1 className="text-2xl font-bold mb-6">Landlord Calendar</h1>
        </div>
        <Calendar></Calendar>
      </div>
    </div>
  );
}
