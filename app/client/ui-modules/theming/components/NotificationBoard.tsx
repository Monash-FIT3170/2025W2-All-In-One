import React from 'react';
import { ApiTask } from '/app/shared/api-models/task/ApiTask';

interface NotificationBoardProps {
  open: boolean;
  onClose: () => void;
  tasks: ApiTask[];
}

export function NotificationBoard({ open, onClose, tasks }: NotificationBoardProps) {
  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-lg">Notifications</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">No pending tasks</div>
        ) : (
          tasks.map((task) => (
            <div key={task.taskId} className="px-4 py-3 border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition">
              <div className="font-medium text-base text-gray-900">{task.name}</div>
              <div className="text-xs text-gray-500 mb-1">Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'N/A'}</div>
            </div>
          ))
        )}
      </div>
      <div className="px-4 py-2 border-t border-gray-100 text-center">
        <button onClick={onClose} className="text-blue-600 hover:underline text-sm">Close</button>
      </div>
    </div>
  );
}
