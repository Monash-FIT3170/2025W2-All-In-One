import React from 'react';
import { TaskStatus } from '/app/shared/task-status-identifier';
import { parse, format, compareAsc } from "date-fns";
import { Task } from '/app/client/library-modules/domain-models/task/Task';
import { Conversation } from '/app/client/library-modules/domain-models/messaging/Conversation';
import { useRef, useEffect } from 'react';

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
  conversations: Conversation[];
}

export function NotificationBellDropdown({ open, onClose, tasks, conversations }: NotificationDropdownProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

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
    .sort((a, b) => {
      const dateA = parse(a.dueDate, "dd/MM/yyyy", new Date());
      const dateB = parse(b.dueDate, "dd/MM/yyyy", new Date());
      return compareAsc(dateB, dateA); // Descending orderc
    });

  return (
    <div ref={popupRef} className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
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
                <div className="font-medium text-base text-gray-900">{task.name}</div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Due: {task.dueDate}</span>
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
        {/* New Messages Section */}
        {(() => {
          const newMessageConversations = conversations.filter(conv => conv.unreadCount > 0);
          const totalUnreadCount = newMessageConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
          const latestConversation = newMessageConversations.sort((a, b) => {
            if (!a.timestamp && !b.timestamp) return 0;
            if (!a.timestamp) return 1;
            if (!b.timestamp) return -1;
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          })[0];

          return newMessageConversations.length > 0 ? (
            <div className="px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium text-base text-gray-900">New Messages</div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {totalUnreadCount}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span>Last: {latestConversation?.timestamp || 'Unknown'}</span>
                {latestConversation && (
                  <>
                    <span>•</span>
                    <span>{latestConversation.name}</span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-900 font-normal">
                Click here to view messages
              </div>
            </div>
          ) : null;
        })()}
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
