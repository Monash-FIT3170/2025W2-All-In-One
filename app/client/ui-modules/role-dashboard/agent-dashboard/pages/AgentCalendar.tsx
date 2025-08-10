import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  selectTasks,
  selectIsLoading,
  fetchAgentTasks,
} from "../state/agent-dashboard-slice";
import { Calendar } from "../../../theming/components/Calendar";
import { Button } from "../../../theming-shadcn/Button";
import { AddTaskModal } from "../components/AddTaskModal";
import { TaskData } from "../components/TaskFormSchema";
import { apiCreateTask } from "/app/client/library-modules/apis/task/task-api";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { TaskPriority } from "/app/shared/task-priority-identifier";

export function AgentCalendar(): React.JSX.Element {
  const dispatch = useAppDispatch(); 
  const currentUser = useAppSelector((state) => state.currentUser.authUser);
  const tasks = useAppSelector(selectTasks); // Retrieve tasks from Redux store
  const loading = useAppSelector(selectIsLoading);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  useEffect(() => { 
    if (currentUser?.userId) {
      dispatch(fetchAgentTasks(currentUser.userId)); // Fetch tasks for the current user
    }
    else {
      console.warn("No user ID found. Please log in to view the calendar.");
    }
  },[currentUser])
  const handleDateSelection = (formatted: string, iso: string) => {
    setSelectedDate(formatted);
    setSelectedDateISO(iso);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTaskSubmit = async (taskData: TaskData) => {
    try {
      if (!currentUser?.userId) {
        console.error("No current user found");
        return;
      }

      // Create the task in the database
      const apiData = {
        name: taskData.name,
        description: taskData.description,
        dueDate: new Date(taskData.dueDate), // Convert string to Date
        priority: taskData.priority,
        userId: currentUser.userId, // Pass the current user's ID
      };
            
      const createdTaskId = await apiCreateTask(apiData);
      console.log("Task created successfully with ID:", createdTaskId);
      
      // Close the modal
      setIsModalOpen(false);
      
      // Refresh tasks to show the new task
      if (currentUser?.userId) {
        dispatch(fetchAgentTasks(currentUser.userId));
      }
      
    } catch (error) {
      console.error("Error creating task:", error);
    }
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
                    : new Date().toLocaleDateString('en-AU')}
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
                <Button onClick={handleOpenModal}>Add Task</Button>
              </div>
            </div>

            {/* Right Section: Upcoming Tasks */}
            <UpcomingTasks tasks={tasks} />
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleTaskSubmit}
      />
    </div>
  );
}
