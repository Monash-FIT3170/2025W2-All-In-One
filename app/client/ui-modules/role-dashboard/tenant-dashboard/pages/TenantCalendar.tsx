import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { Calendar } from "../../../theming/components/Calendar";
import { Button } from "../../../theming-shadcn/Button";
import { UpcomingTasks } from "../../components/UpcomingTask";
import { fetchTenantTasks, selectLoading, selectTasks } from "../state/tenant-dashboard-slice";
import { TaskStatus } from "/app/shared/task-status-identifier";
export function TenantCalendar(): React.JSX.Element {
  const dispatch = useAppDispatch(); 
  const currentUser = useAppSelector((state) => state.currentUser.authUser);
  const tasks = useAppSelector(selectTasks); // Retrieve tasks from Redux store
  const loading = useAppSelector(selectLoading);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);
  useEffect(() => { 
    if (currentUser?.userId) {
      dispatch(fetchTenantTasks(currentUser.userId)); // Fetch tasks for the current user
    }
    else {
      console.warn("No user ID found. Please log in to view the calendar.");
    }
  },[currentUser])
  const handleDateSelection = (formatted: string, iso: string) => {
    setSelectedDate(formatted);
    setSelectedDateISO(iso);
  };
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
                    .filter((task) => task.dueDate === (selectedDateISO || new Date().toISOString().slice(0, 10)))
                    .map((task, index) => (
                      <li key={index} className="p-4 rounded shadow bg-white border border-gray-200">
                        <p className="font-bold text-lg">{task.name}</p>
                        <p className="text-sm text-gray-600 mb-2">{task.dueDate}</p>
                        {task.description && (
                          <p className="text-xs text-gray-500">{task.description}</p>
                        )}
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.status === TaskStatus.COMPLETED
                              ? "bg-green-100 text-green-800"
                              : task.status === TaskStatus.INPROGRESS
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </li>
                    ))}
                  {tasks.filter(task => task.dueDate === (selectedDateISO || new Date().toISOString().slice(0,10))).length === 0 && (
                    <p className="text-gray-500 italic">No tasks for this date</p>
                  )}
                </ul>
                <br />
                <Button>Add Task</Button>
              </div>
            </div>

            {/* Right Section: Upcoming Tasks */}
            <UpcomingTasks tasks={tasks} />
            </div>
          </div>
        </div>
      </div>
)}

