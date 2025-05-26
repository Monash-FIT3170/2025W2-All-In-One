import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { setTasks, selectTasks } from "../state/agent-dashboard-slice";
import {
  fetchAgentTasks,
  selectTasks,
  selectLoading,
} from "../state/agent-dashboard-slice";
import { Calendar } from "../../../theming/components/Calendar";
import { Button } from "../../../theming-shadcn/Button";

export function AgentCalendar(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks); // Retrieve tasks from Redux store
  const loading = useAppSelector(selectLoading);
  const currentUser = useAppSelector((state) => state.currentUser.authUser); // Get the authenticated user

  const [isSidebarOpen, onSideBarOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);

  const handleDateSelection = (formatted: string, iso: string) => {
    setSelectedDate(formatted);
    setSelectedDateISO(iso);
  };

  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchAgentTasks(currentUser.userId)); // Pass the userId to fetchAgentTasks
    }
  }, [dispatch, currentUser?.userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Agent Calendar</h1>
          <div className="flex gap-6">
            {/* Left: Calendar */}
            <div className="flex-1">
              <Calendar
                selectedDateISO={selectedDateISO}
                onDateSelect={handleDateSelection}
              />

              {/* Below Calendar */}
              <div className="mt-4">
                <h2 className="text-lg font-semibold">
                  {selectedDate
                    ? selectedDate
                    : new Date().toLocaleDateString()}
                </h2>
                <ul className="space-y-4 mt-2">
                  {tasks
                    .filter((task) => {
                      if (!task.datetime) return false; // Takss without a date just get passed over

                      // Get the selected date (it should be in YYYY-MM-DD format)
                      const selectedDateObj = selectedDateISO ? new Date(selectedDateISO) : new Date();
                      
                      let taskDateObj;
                      try {
                        // First try direct parsing (might work if it's already a valid date string)
                        taskDateObj = new Date(task.datetime);
                        
                        // Check if the date is valid
                        if (isNaN(taskDateObj.getTime())) {
                          // If not valid, try parsing as DD/MM/YYYY
                          const parts = task.datetime.split('/');
                          if (parts.length === 3) {
                            // Assuming DD/MM/YYYY format
                            taskDateObj = new Date(
                              parseInt(parts[2]), // Year
                              parseInt(parts[1]) - 1, // Month (0-based)
                              parseInt(parts[0]) // Day
                            );
                          }
                        }
                      } catch (e) {
                        console.error("Error parsing date:", e);
                        return false;
                      }
                      
                      // If we still don't have a valid date, skip this task
                      if (!taskDateObj || isNaN(taskDateObj.getTime())) {
                        return false;
                      }
                      
                      // Compare only the date part (year, month, day)
                      // WE don't care about time here because we are selecting a date on the calendar, not a time
                      return (
                        selectedDateObj.getFullYear() === taskDateObj.getFullYear() &&
                        selectedDateObj.getMonth() === taskDateObj.getMonth() &&
                        selectedDateObj.getDate() === taskDateObj.getDate()
                      );
                    })
                    .map((task, index) => (
                      <li key={index} className="p-4 rounded shadow bg-white border border-gray-200">
                        <p className="font-bold text-lg">{task.title}</p>
                        <p className="text-sm text-gray-600 mb-2">{task.datetime}</p>
                        {task.description && (
                          <p className="text-xs text-gray-500">{task.description}</p>
                        )}
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.status === "Overdue" 
                              ? "bg-red-100 text-red-800" 
                              : task.status === "Due Soon" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </li>
                    ))}
                  {tasks.filter(task => {
                    if (!task.datetime) return false;
                    
                    // Get the selected date
                    const selectedDateObj = selectedDateISO ? new Date(selectedDateISO) : new Date();
                    
                    // Try to parse the task date
                    let taskDateObj;
                    try {
                      // First try direct parsing
                      taskDateObj = new Date(task.datetime);
                      
                      // Check if the date is valid
                      if (isNaN(taskDateObj.getTime())) {
                        // If not valid, try parsing as DD/MM/YYYY
                        const parts = task.datetime.split('/');
                        if (parts.length === 3) {
                          taskDateObj = new Date(
                            parseInt(parts[2]), // Year
                            parseInt(parts[1]) - 1, // Month (0-based)
                            parseInt(parts[0]) // Day
                          );
                        }
                      }
                    } catch (e) {
                      return false;
                    }
                    
                    if (!taskDateObj || isNaN(taskDateObj.getTime())) {
                      return false;
                    }
                    
                    // Compare only the date part
                    return (
                      selectedDateObj.getFullYear() === taskDateObj.getFullYear() &&
                      selectedDateObj.getMonth() === taskDateObj.getMonth() &&
                      selectedDateObj.getDate() === taskDateObj.getDate()
                    );
                  }).length === 0 && (
                    <p className="text-gray-500 italic">No tasks for this date</p>
                  )}
                </ul>
                <br />
                <Button>Add Task</Button>
              </div>
            </div>

            {/* Right Section: Upcoming Tasks */}
            <div className="w-1/3">
              <h2 className="text-lg font-semibold mb-4">Upcoming Tasks</h2>
              <ul className="space-y-4">
                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <li key={index} className="p-4 rounded shadow bg-white border border-gray-200">
                      <p className="font-bold text-lg">{task.title}</p>
                      <p className="text-sm text-gray-600 mb-2">{task.datetime}</p>
                      <p className="text-xs text-gray-500">{task.description}</p>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.status === "Overdue" 
                            ? "bg-red-100 text-red-800" 
                            : task.status === "Due Soon" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No upcoming tasks</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
