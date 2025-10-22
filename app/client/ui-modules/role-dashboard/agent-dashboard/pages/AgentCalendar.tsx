import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  selectCalendarTasks,
  selectCalendarLoading,
  fetchAgentCalendarTasks,
  selectCalendarMarkers,
  deleteCalendarTask,
  updateAgentCalendarTaskStatus,
  updateAgentCalendarTask,
} from "../state/agent-calendar-slice";
import { Calendar } from "../../../theming/components/Calendar";
import { Button } from "../../../theming-shadcn/Button";
import { TaskModal } from "../components/TaskModal";
import { apiCreateTaskForAgent } from "/app/client/library-modules/apis/task/task-api";
import { PropertyOption, TaskData } from "../components/TaskFormSchema";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
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

  const [selectedDate, setSelectedDate] = useState<string | null>(getTodayAUDate());
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(getTodayISODate());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
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


// normalises date/iso string to YYYY-MM-DD
  const toISODateOnly = (d: string | Date) => {
    const dt = typeof d === "string" ? new Date(d) : d;
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // priorities for tasks
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


  const handleOpenModal = () => {
    setModalMode('add');
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleEditTask = (task: Task) => {
    setModalMode('edit');
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleTaskSubmit = async (taskData: TaskData, taskId?: string) => {
    if (!currentUser?.userId) {
      console.error("No current user found");
      return;
    }

    try {
      if (taskId) {
        // Edit mode
        await dispatch(updateAgentCalendarTask({
          taskId,
          name: taskData.name,
          description: taskData.description,
          dueDate: new Date(taskData.dueDate),
          priority: taskData.priority,
          propertyAddress: taskData.propertyAddress,
          propertyId: taskData.propertyId,
        }));
        console.log("Task updated successfully");
      } else {
        // Add mode
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
      }

      setIsModalOpen(false);
      setTaskToEdit(null);
      dispatch(fetchAgentCalendarTasks(currentUser.userId));
    } catch (error) {
      console.error("Error saving task:", error);
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

  const handleTaskStatusUpdate = async (taskId: string, status: TaskStatus) => {
    try {
      await dispatch(updateAgentCalendarTaskStatus({
        taskId,
        status
      }));
      console.log(`Task ${taskId} status updated to ${status}`);
    } catch (error) {
      console.error("Failed to update task status:", error);
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
                dateBadges={dateBadges}
              />

              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">
                    {selectedDate ? selectedDate : getTodayAUDate()}
                  </h2>
                  <Button onClick={handleOpenModal}>Add Task</Button>
                </div>
                <CalendarTasksList 
                  tasks={tasks}
                  selectedDateISO={selectedDateISO}
                  showPropertyAddress={true}
                  onDeleteTask={handleDeleteTask}
                  onUpdateTaskStatus={handleTaskStatusUpdate}
                  onEditTask={handleEditTask}
                />
                <br />
                <TaskMap mapUiState={mapUiState} className="mb-3" />
              </div>
            </div>
            <UpcomingTasks tasks={tasks} showViewAllButton={false} />
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleTaskSubmit}
        properties={properties}
        mode={modalMode}
        task={taskToEdit}
      />
    </div>
  );
}
