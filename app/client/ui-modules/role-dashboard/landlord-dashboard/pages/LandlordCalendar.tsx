import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { setTasks, selectTasks } from "../state/landlord-dashboard-slice";
import { RoleSideNavBar } from "../../../navigation-bars/side-nav-bars/SideNavbar";
import { LandlordTopNavbar } from "../../../navigation-bars/TopNavbar";
import {
  landlordDashboardLinks,
  settingLinks,
} from "../../../navigation-bars/side-nav-bars/side-nav-link-definitions";
import { Calendar } from "../../../theming/components/Calendar";
import { Button } from "../../../theming-shadcn/Button";
export function LandlordCalendar(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks); // Retrieve tasks from Redux store

  const [isSidebarOpen, onSideBarOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);

  const handleDateSelection = (formatted: string, iso: string) => {
    setSelectedDate(formatted);
    setSelectedDateISO(iso);
  };

  useEffect(() => {
    // Dispatch dummy tasks to the Redux store
    // This useEffect hook is used to set the initial state of tasks when the component mounts.
    dispatch(
      setTasks([
        {
          title: "Select tenants",
          address: "123 Main St",
          datetime: "20/05/2025",
          status: "Upcoming",
        },
        {
          title: "First listing meeting with agent",
          address: "456 Oak Ave",
          datetime: "25/05/2025",
          status: "Due Soon",
        },
        {
          title: "Follow up meeting with agent",
          address: "789 Pine St",
          datetime: "30/05/2025",
          status: "Upcoming",
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
          dashboardLinks={landlordDashboardLinks} // Pass the dashboard links to the sidebar
          settingsLinks={settingLinks} // Pass the links to the sidebar
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
                  {selectedDate
                    ? selectedDate
                    : new Date().toLocaleDateString()}
                </h2>
                {tasks
                  .filter((task) => {
                    // Normalize both dates to YYYY-MM-DD for comparison
                    const normalizedSelectedDate = selectedDateISO; // Already in ISO format (YYYY-MM-DD)
                    const normalizedTaskDate = new Date(
                      task.datetime.split("/").reverse().join("-") // Convert DD/MM/YYYY to YYYY-MM-DD
                    )
                      .toISOString()
                      .split("T")[0];
                    return normalizedTaskDate == normalizedSelectedDate;
                  })
                  .map((task, index) => (
                    <li key={index} className="p-4 rounded shadow">
                      <p className="font-bold">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.datetime}</p>
                      <p className="text-sm text-blue-500">{task.status}</p>
                    </li>
                  ))}
                  <br />
                  <Button>Add Task</Button>
              </div>
            </div>

            {/* Right Section: Upcoming Tasks */}
            <div className="w-1/3">
              <h2 className="text-lg font-semibold mb-4">Upcoming Tasks</h2>
              <ul className="space-y-2">
                {tasks.map((task, index) => (
                  <li key={index} className="p-4 rounded shadow">
                    <p className="font-bold">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.datetime}</p>
                    <p className="text-sm text-blue-500">{task.status}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
