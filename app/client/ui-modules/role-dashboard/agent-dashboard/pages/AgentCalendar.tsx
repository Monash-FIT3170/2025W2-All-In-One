import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  selectTasks,
  selectLoading,
  fetchAgentTasks,
  selectMarkers,
} from "../state/agent-dashboard-slice";
import { Calendar } from "../../../theming/components/Calendar";
import { Button } from "../../../theming-shadcn/Button";
import { AddTaskModal } from "../components/AddTaskModal";
import { apiCreateTaskForAgent } from "/app/client/library-modules/apis/task/task-api";
import { PropertyOption, TaskData } from "../components/TaskFormSchema";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { UpcomingTasks } from "../../components/UpcomingTask";
import { TaskMap, TaskMapUiState } from "../components/TaskMap";
import {
  getTodayISODate,
  getTodayAUDate,
} from "/app/client/library-modules/utils/date-utils";
import { fetchPropertiesForAgent } from "../state/agent-dashboard-slice";
import { Agent } from "/app/client/library-modules/domain-models/user/Agent";
import { fetchMarkersForDate } from "../state/agent-dashboard-slice";
export function AgentCalendar(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const currentAgent = useAppSelector(
    (state) => state.currentUser.currentUser
  ) as Agent | undefined;
  const currentUser = useAppSelector((state) => state.currentUser.authUser);
  const tasks = useAppSelector(selectTasks);
  const loading = useAppSelector(selectLoading);
  const markers = useAppSelector(selectMarkers);

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
      dispatch(fetchAgentTasks(currentUser.userId));
      console.log("Fetching agent tasks");
    }
  }, [dispatch, currentUser?.userId]);

  // Fetch properties for the agent
  useEffect(() => {
    if (!currentAgent?.agentId) return;
    fetchPropertiesForAgent(currentAgent.agentId)
      .then(setProperties)
      .catch((err) => console.error("Failed to fetch properties:", err));
  }, [currentAgent?.agentId]);

  // Update map markers for selected date

  useEffect(() => {
    dispatch(
      fetchMarkersForDate({
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
      dispatch(fetchAgentTasks(currentUser.userId));
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

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
                <ul className="space-y-4 mt-2">
                  {tasks
                    .filter(
                      (task) =>
                        task.dueDate === (selectedDateISO || getTodayISODate())
                    )
                    .map((task, index) => (
                      <li
                        key={index}
                        className="p-4 rounded shadow bg-white border border-gray-200"
                      >
                        <p className="font-bold text-lg">{task.name}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          {task.dueDate}
                        </p>
                        {task.description && (
                          <p className="text-xs text-gray-500">
                            {task.description}
                          </p>
                        )}
                        <p className="text-sm text-gray-700 mt-1">
                          {task.propertyAddress}
                        </p>
                        <div className="mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              task.status === TaskStatus.COMPLETED
                                ? "bg-green-100 text-green-800"
                                : task.status === TaskStatus.INPROGRESS
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </li>
                    ))}
                  {tasks.filter(
                    (task) =>
                      task.dueDate === (selectedDateISO || getTodayISODate())
                  ).length === 0 && (
                    <p className="text-gray-500 italic">
                      No tasks for this date
                    </p>
                  )}
                </ul>
                <br />
                <TaskMap mapUiState={mapUiState} />
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
