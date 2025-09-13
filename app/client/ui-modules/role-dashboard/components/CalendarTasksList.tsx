import React from "react";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { getTodayISODate } from "/app/client/library-modules/utils/date-utils";

interface CalendarTasksListProps {
  tasks: Task[];
  selectedDateISO: string | null;
  showPropertyAddress?: boolean; // true for Agent/Landlord, false for Tenant
}

export function CalendarTasksList({
  tasks,
  selectedDateISO,
  showPropertyAddress = true
}: CalendarTasksListProps): React.JSX.Element {
  const targetDate = selectedDateISO || getTodayISODate();
  const filteredTasks = tasks.filter((task) => task.dueDate === targetDate);

  return (
    <ul className="space-y-4 mt-2">
      {filteredTasks.map((task, index) => (
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
          {showPropertyAddress && (
            <p className="text-sm text-gray-700 mt-1">
              {task.propertyAddress}
            </p>
          )}
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
      {filteredTasks.length === 0 && (
        <p className="text-gray-500 italic">
          No tasks for this date
        </p>
      )}
    </ul>
  );
}
