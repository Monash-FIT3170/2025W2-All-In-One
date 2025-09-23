import React from "react";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { getTodayISODate } from "/app/client/library-modules/utils/date-utils";
import { Button } from "../../theming-shadcn/Button";

interface CalendarTasksListProps {
  tasks: Task[];
  selectedDateISO: string | null;
  showPropertyAddress?: boolean; // true for Agent/Landlord, false for Tenant
  onDeleteTask?: (taskId: string) => void; // Callback for delete functionality
  onUpdateTaskStatus?: (taskId: string, status: TaskStatus) => void; // Callback for status update functionality
}

export function CalendarTasksList({
  tasks,
  selectedDateISO,
  showPropertyAddress = true,
  onDeleteTask,
  onUpdateTaskStatus
}: CalendarTasksListProps): React.JSX.Element {
  const targetDate = selectedDateISO || getTodayISODate();
  const filteredTasks = tasks.filter((task) => task.dueDate === targetDate);

  const handleStatusChange = (taskId: string, newStatus: string) => {
    if (onUpdateTaskStatus && Object.values(TaskStatus).includes(newStatus as TaskStatus)) {
      onUpdateTaskStatus(taskId, newStatus as TaskStatus);
    }
  };

  return (
    <ul className="space-y-4 mt-2">
      {filteredTasks.map((task, index) => (
        <li
          key={index}
          className="p-4 rounded shadow bg-white border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-bold text-lg">{task.name}</p>
              <p className="text-sm text-gray-600 mb-2">
                {task.dueDate}
              </p>
              {task.description && (
                <p className="text-xs text-gray-500">
                  {task.description}
                </p>
              )}
              {showPropertyAddress && (
                <p className="text-sm text-gray-700 mt-1">
                  {task.propertyAddress}
                </p>
              )}
              <div className="mt-2">
                {onUpdateTaskStatus ? (
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.taskId, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer ${
                      task.status === TaskStatus.COMPLETED
                        ? "bg-green-100 text-green-800 focus:ring-green-500"
                        : task.status === TaskStatus.INPROGRESS
                          ? "bg-yellow-100 text-yellow-800 focus:ring-yellow-500"
                          : "bg-blue-100 text-blue-800 focus:ring-blue-500"
                    }`}
                  >
                    <option value={TaskStatus.NOTSTARTED}>{TaskStatus.NOTSTARTED}</option>
                    <option value={TaskStatus.INPROGRESS}>{TaskStatus.INPROGRESS}</option>
                    <option value={TaskStatus.COMPLETED}>{TaskStatus.COMPLETED}</option>
                  </select>
                ) : (
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
                )}
              </div>
            </div>
            {onDeleteTask && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDeleteTask(task.taskId)}
                className="ml-2 text-xs"
              >
                Delete
              </Button>
            )}
          </div>
        </li>
      ))}
      {filteredTasks.length === 0 && (
        <p className="text-gray-500 italic">
          No tasks for this date
        </p>
      )}
    </ul>
  );
}
