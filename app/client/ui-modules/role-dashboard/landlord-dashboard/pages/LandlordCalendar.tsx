import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  selectLandlordCalendarTasks,
  selectLandlordCalendarLoading,
  fetchLandlordCalendarTasks,
  selectLandlordCalendarMarkers,
  deleteLandlordCalendarTask,
} from "../../landlord-dashboard/state/landlord-calendar-slice";
import { Calendar } from "../../../theming/components/Calendar";
import { Button } from "../../../theming-shadcn/Button";
import { AddTaskModal } from "../../agent-dashboard/components/AddTaskModal";
import { apiCreateTaskForLandlord } from "/app/client/library-modules/apis/task/task-api";
import { PropertyOption, TaskData } from "../../agent-dashboard/components/TaskFormSchema";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { UpcomingTasks } from "../../components/UpcomingTask";
import { CalendarTasksList } from "../../components/CalendarTasksList";
import { TaskMap, TaskMapUiState } from "../../agent-dashboard/components/TaskMap";
import {
  getTodayISODate,
  getTodayAUDate,
} from "/app/client/library-modules/utils/date-utils";
import { fetchPropertiesForLandlordCalendar } from "../../landlord-dashboard/state/landlord-calendar-slice";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { fetchLandlordCalendarMarkersForDate } from "../../landlord-dashboard/state/landlord-calendar-slice";
export function LandlordCalendar(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const currentLandlord = useAppSelector(
    (state) => state.currentUser.currentUser
  ) as Landlord | undefined;
  const currentUser = useAppSelector((state) => state.currentUser.authUser);
  const tasks = useAppSelector(selectLandlordCalendarTasks);
  const loading = useAppSelector(selectLandlordCalendarLoading);
  const markers = useAppSelector(selectLandlordCalendarMarkers);

  const [selectedDate, setSelectedDate] = useState<string | null>(getTodayAUDate());
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(getTodayISODate());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [mapUiState, setMapUiState] = useState<TaskMapUiState>({ markers: [] });

  useEffect(() => {
    setMapUiState({ markers });
  }, [markers]);

  // Fetch tasks for the current user
  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchLandlordCalendarTasks());
      console.log("Fetching landlord calendar tasks");
      console.log("The current User Id is" + currentUser?.userId);
    }
  }, [dispatch, currentUser?.userId]);

  // Fetch properties for the landlord
  useEffect(() => {
    if (!currentLandlord?.landlordId) return;
    fetchPropertiesForLandlordCalendar(currentLandlord.landlordId)
      .then(setProperties)
      .catch((err) => console.error("Failed to fetch properties:", err));
  }, [currentLandlord?.landlordId]);

  // Update map markers for selected date

  useEffect(() => {
    dispatch(
      fetchLandlordCalendarMarkersForDate({
        tasks,
        selectedDateISO: selectedDateISO ?? undefined,
      })
    );
  }, [tasks, selectedDateISO, dispatch]);

  // Handle date selection from the calendar
  const handleDateSelection = (formatted: string, iso: string) => {
    setSelectedDate(formatted);
    setSelectedDateISO(iso);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // 
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

      const createdTaskId = await apiCreateTaskForLandlord(apiData);
      console.log("Task created successfully with ID:", createdTaskId);
      
      setIsModalOpen(false);
      // Refresh calendar tasks to show the newly created task
      dispatch(fetchLandlordCalendarTasks());
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!currentLandlord?.landlordId) {
      console.error("No current landlord found");
      return;
    }

    try {
      await dispatch(deleteLandlordCalendarTask({
        taskId,
        landlordId: currentLandlord.landlordId
      }));
      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };


  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen">
      <div className="flex">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Landlord Calendar</h1>
          <div className="flex gap-6">
            {/* Left: Calendar */}
            <div className="flex-1">
              <Calendar
                selectedDateISO={selectedDateISO}
                onDateSelect={handleDateSelection}
                dateBadges={dateBadges}
              />

              <div className="mt-4">
                <h2 className="text-lg font-semibold">
                  {selectedDate ? selectedDate : getTodayAUDate()}
                </h2>
                <CalendarTasksList 
                  tasks={tasks}
                  selectedDateISO={selectedDateISO}
                  showPropertyAddress={true}
                  onDeleteTask={handleDeleteTask}
                />
                <br />
                <TaskMap mapUiState={mapUiState} />
                <Button onClick={handleOpenModal}>Add Task</Button>
              </div>
            </div>
            <UpcomingTasks tasks={tasks} showViewAllButton={false} />
          </div>
        </div>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleTaskSubmit}
        properties={properties} // pass the fetched properties
      />
    </div>
  );
}
