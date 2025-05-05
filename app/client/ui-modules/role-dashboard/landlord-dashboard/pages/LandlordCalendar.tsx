import React, { useState } from "react";
import { RoleSideNavBar } from "../../../navigation-bars/side-nav-bars/SideNavbar";
import { LandlordTopNavbar } from "../../../navigation-bars/TopNavbar";
import {
  landlordDashboardLinks,
  settingLinks,
} from "../../../navigation-bars/side-nav-bars/side-nav-link-definitions";
import { Calendar } from "../../../theming/components/Calendar";

export function LandlordCalendar(): React.JSX.Element {
  const [isSidebarOpen, onSideBarOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);

  const handleDateSelection = (formatted: string, iso: string) => {
    setSelectedDate(formatted);
    setSelectedDateISO(iso);
  };

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
          <div className="flex gap-6">
            {/* Left Section: Calendar */}
            <div className="flex-1">
              <Calendar
                selectedDateISO={selectedDateISO}
                onDateSelect={handleDateSelection}
              />

              {/* Below the Calendar */}
              <div className="mt-4">
                <h2 className="text-lg font-semibold">
                  {selectedDate ? selectedDate : "No date selected"}
                </h2>
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Add Event
                </button>
              </div>
            </div>

            {/* Right Section: Upcoming Tasks */}
            <div className="w-1/3">
              <h2 className="text-lg font-semibold mb-4">Upcoming Tasks</h2>
              <ul className="space-y-2">
                <li className="p-4 rounded shadow">
                  Task 1: Review tenant applications
                </li>
                <li className="p-4 rounded shadow">
                  Task 2: Schedule property inspection
                </li>
                <li className="p-4 rounded shadow">
                  Task 3: Update rental agreements
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
