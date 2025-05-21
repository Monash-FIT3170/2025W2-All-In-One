import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { RoleSideNavBar } from "../../../navigation-bars/side-nav-bars/SideNavbar";
import { AgentTopNavbar } from "../../../navigation-bars/TopNavbar";
import {
  agentDashboardLinks,
  settingLinks,
} from "../../../navigation-bars/side-nav-bars/side-nav-link-definitions";
import { fetchAgentTasks, selectTasks, selectLoading } from "../state/agent-dashboard-slice";
import { Calendar } from "../../../theming/components/Calendar";
import { Button } from "../../../theming-shadcn/Button";
export function AgentCalendar(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks); // Retrieve tasks from Redux store

  const [isSidebarOpen, onSideBarOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);
  const loading = useAppSelector(selectLoading);

  const handleDateSelection = (formatted: string, iso: string) => {
    setSelectedDate(formatted);
    setSelectedDateISO(iso);
  };

  useEffect(() => {
    // Replace "1" with the actual user ID of the agent
    dispatch(fetchAgentTasks("1"));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen">
      <AgentTopNavbar onSideBarOpened={onSideBarOpened} />
      <div className="flex">
        <RoleSideNavBar
          isOpen={isSidebarOpen}
          onClose={() => onSideBarOpened(false)}
          dashboardLinks={agentDashboardLinks} // Pass the dashboard links to the sidebar
          settingsLinks={settingLinks} // Pass the links to the sidebar
        />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Agent Calendar</h1>
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
