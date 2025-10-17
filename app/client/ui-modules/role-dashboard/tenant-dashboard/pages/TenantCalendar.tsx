import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { Calendar } from "../../../theming/components/Calendar";
import { Button } from "../../../theming-shadcn/Button";
import { UpcomingTasks } from "../../components/UpcomingTask";
import { CalendarTasksList } from "../../components/CalendarTasksList";
import { AddTaskModal } from "../../agent-dashboard/components/AddTaskModal";
import { PropertyOption, TaskData } from "../../agent-dashboard/components/TaskFormSchema";
import { 
  fetchTenantCalendarTasks, 
  selectTenantCalendarLoading, 
  selectTenantCalendarTasks,
  deleteTenantCalendarTask,
  updateTenantCalendarTaskStatus,
} from "../state/reducers/tenant-calendar-slice";
import { apiCreateTaskForTenant } from "/app/client/library-modules/apis/task/task-api";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { getTodayAUDate, getTodayISODate } from "/app/client/library-modules/utils/date-utils";
import { Tenant } from "/app/client/library-modules/domain-models/user/Tenant";

export function TenantCalendar(): React.JSX.Element {
  const dispatch = useAppDispatch(); 
  const currentTenant = useAppSelector(
    (state) => state.currentUser.currentUser
  ) as Tenant | undefined;
  const currentUser = useAppSelector((state) => state.currentUser.authUser);
  const tasks = useAppSelector(selectTenantCalendarTasks); // Retrieve tasks from Redux store
  const loading = useAppSelector(selectTenantCalendarLoading);
  const [selectedDate, setSelectedDate] = useState<string | null>(getTodayAUDate());
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(getTodayISODate());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [properties] = useState<PropertyOption[]>([]); // Tenants don't manage properties, so empty array
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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleTaskSubmit = async (taskData: TaskData) => {
    if (!currentUser?.userId) {
      console.error("No current user found");
      return;
    }

    try {
      const apiData = {
        name: taskData.name,
        description: taskData.description,
        dueDate: new Date(taskData.dueDate),
        priority: taskData.priority,
        userId: currentUser.userId,
        propertyAddress: taskData.propertyAddress,
        propertyId: taskData.propertyId || "",
      };

      const createdTaskId = await apiCreateTaskForTenant(apiData);
      console.log("Task created successfully with ID:", createdTaskId);

      setIsModalOpen(false);
      // Refresh tasks to show the newly created task
      dispatch(fetchTenantCalendarTasks(currentUser.userId));
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };


  
  const toISODateOnly = (d: string | Date) => {
    const dt = typeof d === "string" ? new Date(d) : d;
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  type Priority = "low" | "medium" | "high";

  // maps badges of tasks for each date
  const dateBadges = React.useMemo(() => {
    const map: Record<string, { total: number; counts: Partial<Record<Priority, number>> }> = {};
    for (const t of tasks as any[]) {
      if (!t?.dueDate) continue;
      
      const iso = toISODateOnly(t.dueDate);
      
      const p: Priority = (t.priority as Priority) ?? "medium";
      
      map[iso] ??= { total: 0, counts: {} };
      
      map[iso].total += 1;
      
      map[iso].counts[p] = (map[iso].counts[p] ?? 0) + 1;
    
    }
    return map;
  }, [tasks]);

  const handleDeleteTask = async (taskId: string) => {
    if (!currentTenant?.tenantId) {
      console.error("No current tenant found");
      return;
    }

    try {
      await dispatch(deleteTenantCalendarTask({
        taskId,
        tenantId: currentTenant.tenantId
      }));
      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskStatusUpdate = async (taskId: string, status: TaskStatus) => {
    try {
      await dispatch(updateTenantCalendarTaskStatus({
        taskId,
        status
      }));
      console.log(`Task ${taskId} status updated to ${status}`);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your calendar..." size="md" />;
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
                dateBadges={dateBadges}
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
                  onDeleteTask={handleDeleteTask}
                  onUpdateTaskStatus={handleTaskStatusUpdate}
                />
                <br />
                <Button onClick={handleOpenModal}>Add Task</Button>
              </div>
            </div>

            {/* Right Section: Upcoming Tasks */}
            <UpcomingTasks tasks={tasks} showViewAllButton={false} />
          </div>
        </div>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleTaskSubmit}
        properties={properties} // Empty array for tenants
      />
    </div>
  );
}

