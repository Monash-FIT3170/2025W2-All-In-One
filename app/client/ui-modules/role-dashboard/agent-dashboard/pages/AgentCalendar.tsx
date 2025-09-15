import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  selectCalendarTasks,
  selectCalendarLoading,
  fetchAgentCalendarTasks,
  selectCalendarMarkers,
  deleteCalendarTask,
} from "../state/agent-calendar-slice";
import { Calendar } from "../../../theming/components/Calendar";
import { Button } from "../../../theming-shadcn/Button";
import { AddTaskModal } from "../components/AddTaskModal";
import { apiCreateTaskForAgent } from "/app/client/library-modules/apis/task/task-api";
import { PropertyOption, TaskData } from "../components/TaskFormSchema";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { UpcomingTasks } from "../../components/UpcomingTask";
import { CalendarTasksList } from "../../components/CalendarTasksList";
import { TaskMap, TaskMapUiState } from "../components/TaskMap";
import {
  getTodayISODate,
  getTodayAUDate,
} from "/app/client/library-modules/utils/date-utils";
import { fetchPropertiesForAgentCalendar } from "../state/agent-calendar-slice";
import { Agent } from "/app/client/library-modules/domain-models/user/Agent";
import { fetchCalendarMarkersForDate } from "../state/agent-calendar-slice";
import { LoadingSpinner } from "../../../common/LoadingSpinner";
export function AgentCalendar(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const currentAgent = useAppSelector(
    (state) => state.currentUser.currentUser
  ) as Agent | undefined;
  const currentUser = useAppSelector((state) => state.currentUser.authUser);
  const tasks = useAppSelector(selectCalendarTasks);
  const loading = useAppSelector(selectCalendarLoading);
  const markers = useAppSelector(selectCalendarMarkers);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [mapUiState, setMapUiState] = useState<TaskMapUiState>({ markers: [] });

  useEffect(() => {
    setMapUiState({ markers });
  }, [markers]);

  // Fetch tasks for the current user
  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchAgentCalendarTasks(currentUser.userId));
      console.log("Fetching agent calendar tasks");
    }
  }, [dispatch, currentUser?.userId]);

  // Fetch properties for the agent
  useEffect(() => {
    if (!currentAgent?.agentId) return;
    fetchPropertiesForAgentCalendar(currentAgent.agentId)
      .then(setProperties)
      .catch((err) => console.error("Failed to fetch properties:", err));
  }, [currentAgent?.agentId]);

  // Update map markers for selected date

  useEffect(() => {
    dispatch(
      fetchCalendarMarkersForDate({
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

      const createdTaskId = await apiCreateTaskForAgent(apiData);
      console.log("Task created successfully with ID:", createdTaskId);

      setIsModalOpen(false);
      dispatch(fetchAgentCalendarTasks(currentUser.userId));
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!currentAgent?.agentId) {
      console.error("No current agent found");
      return;
    }

    try {
      await dispatch(deleteCalendarTask({
        taskId,
        agentId: currentAgent.agentId
      }));
      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your calendar..." />;

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
                <TaskMap mapUiState={mapUiState} className="mb-3" />
                <Button onClick={handleOpenModal}>Add Task</Button>
              </div>
            </div>
            <UpcomingTasks tasks={tasks} />
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
