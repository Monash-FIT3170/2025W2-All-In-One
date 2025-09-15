import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { Calendar } from "../../../theming/components/Calendar";
import { Button } from "../../../theming-shadcn/Button";
import { UpcomingTasks } from "../../components/UpcomingTask";
import { CalendarTasksList } from "../../components/CalendarTasksList";
import { 
  fetchTenantCalendarTasks, 
  selectTenantCalendarLoading, 
  selectTenantCalendarTasks 
} from "../state/reducers/tenant-calendar-slice";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { getTodayISODate } from "/app/client/library-modules/utils/date-utils";

export function TenantCalendar(): React.JSX.Element {
  const dispatch = useAppDispatch(); 
  const currentUser = useAppSelector((state) => state.currentUser.authUser);
  const tasks = useAppSelector(selectTenantCalendarTasks); // Retrieve tasks from Redux store
  const loading = useAppSelector(selectTenantCalendarLoading);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);
  useEffect(() => { 
    if (currentUser?.userId) {
      dispatch(fetchTenantCalendarTasks(currentUser.userId)); // Fetch tasks for the current user
    }
    else {
      console.warn("No user ID found. Please log in to view the calendar.");
    }
  }, [currentUser, dispatch]);
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
          <h1 className="text-2xl font-bold mb-6">Tenant Calendar</h1>
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
                <CalendarTasksList 
                  tasks={tasks}
                  selectedDateISO={selectedDateISO}
                  showPropertyAddress={false}
                />
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

