import React from 'react';
import { TaskStatus } from '/app/shared/task-status-identifier';
import { parse, format, compareAsc } from "date-fns";

// test comment
interface Task {
  title: string;
  datetime: string;
  status: string;
  description?: string;
  priority?: string;
  taskId?: string;
}

interface NotificationBoardProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
}

export function NotificationBoard({ open, onClose, tasks }: NotificationBoardProps) {
  if (!open) return null;

  const formatTaskDate = (date: Date): string => {
    if (!date || isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return format(date, 'MMM d, h:mm a');
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case TaskStatus.NOTSTARTED:
        return "bg-blue-100 text-blue-800";
      case TaskStatus.INPROGRESS:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const transformedTasks = tasks
    .filter((task) => task.status !== TaskStatus.COMPLETED) // Filter out completed tasks
    .map((task) => {
      try {
        // Parse the datetime string (assuming DD/MM/YYYY format)
        const dueDate = parse(task.datetime, "dd/MM/yyyy", new Date());

        // Format the date to match the design
        const formattedDate = formatTaskDate(dueDate);

        return {
          ...task,
          datetime: formattedDate,
        };
      } catch (error) {
        console.error('Error parsing date:', task.datetime);
        return {
          ...task,
          datetime: 'Invalid Date',
        };
      }
    })
    .sort((a, b) => {
      try {
        const dateA = parse(a.datetime, "dd/MM/yyyy", new Date());
        const dateB = parse(b.datetime, "dd/MM/yyyy", new Date());
        return compareAsc(dateA, dateB);
      } catch (error) {
        return 0;
      }
    });

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-lg">Notifications</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close notifications"
        >
          &times;
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {transformedTasks.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">No pending tasks</div>
        ) : (
          transformedTasks.map((task) => (
            <div
              key={task.taskId}
              className="px-4 py-3 border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium text-base text-gray-900">{task.title}</div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Due: {task.datetime}</span>
                {task.priority && (
                  <>
                    <span>•</span>
                    <span>Priority: {task.priority}</span>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-4 py-2 border-t border-gray-100 text-center">
        <button
          onClick={onClose}
          className="text-blue-600 hover:underline text-sm"
          aria-label="Close notifications"
        >
          Close
        </button>
      </div>
    </div>
  );
}
