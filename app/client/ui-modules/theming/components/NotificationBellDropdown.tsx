import React from 'react';
import { TaskStatus } from '/app/shared/task-status-identifier';
import { parse, format, compareAsc } from "date-fns";
import { Task } from '/app/client/library-modules/domain-models/task/Task';
import { Conversation } from '/app/client/library-modules/domain-models/messaging/Conversation';
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { NavigationPath } from '../../../navigation';
import { useAppSelector, useAppDispatch } from '/app/client/store';
import { Role } from '/app/shared/user-role-identifier';
import {
  selectNotificationTasks,
  selectNotificationConversations,
  selectUnreadMessageCount,
  fetchNotificationTasks,
  updateNotificationConversations
} from '../state/notification-slice';
import { useNotificationSubscriptions } from '../hooks/useNotificationSubscriptions';

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  tasks?: Task[]; // Made optional since we'll use Redux state
  conversations?: Conversation[]; // Made optional since we'll use Redux state
}

export function NotificationBellDropdown({ open, onClose, tasks, conversations }: NotificationDropdownProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.currentUser.authUser);

  // Get data from Redux notification slice
  const reduxTasks = useAppSelector(selectNotificationTasks);
  const reduxConversations = useAppSelector(selectNotificationConversations);
  const unreadMessageCount = useAppSelector(selectUnreadMessageCount);

  // Use Redux data if available, otherwise fall back to props
  const displayTasks = reduxTasks.length > 0 ? reduxTasks : (tasks || []);
  const displayConversations = reduxConversations.length > 0 ? reduxConversations : (conversations || []);

  // Use notification subscriptions for real-time updates
  useNotificationSubscriptions({ enabled: true });

  // Fetch notification data when dropdown opens
  useEffect(() => {
    if (open && authUser) {
      dispatch(fetchNotificationTasks());
      dispatch(updateNotificationConversations());
    }
  }, [open, authUser, dispatch]);

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

  const handleMessagesClick = () => {
    if (!authUser?.role) return;

    let messagesPath: string;
    switch (authUser.role) {
      case Role.AGENT:
        messagesPath = NavigationPath.AgentMessages;
        break;
      case Role.LANDLORD:
        messagesPath = NavigationPath.LandlordMessages;
        break;
      case Role.TENANT:
        messagesPath = NavigationPath.TenantMessages;
        break;
      default:
        return; // Don't navigate if role is unknown
    }

    navigate(messagesPath);
    onClose(); // Close the dropdown after navigation
  };

  const transformedTasks = displayTasks
    .filter((task) => {
      // Only show upcoming tasks: Not Started and In Progress
      return task.status === TaskStatus.NOTSTARTED || task.status === TaskStatus.INPROGRESS;
    })
    .sort((a, b) => {
      // Handle different date formats more robustly
      const parseDate = (dateStr: string) => {
        // Try parsing as dd/MM/yyyy first
        let date = parse(dateStr, "dd/MM/yyyy", new Date());
        if (isNaN(date.getTime())) {
          // If that fails, try parsing as ISO string or other formats
          date = new Date(dateStr);
        }
        return date;
      };

      const dateA = parseDate(a.dueDate);
      const dateB = parseDate(b.dueDate);

      // Handle invalid dates
      if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;

      return compareAsc(dateB, dateA); // Descending order
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
          const newMessageConversations = displayConversations.filter(conv => conv.unreadCount > 0);
          const totalUnreadCount = unreadMessageCount > 0 ? unreadMessageCount : newMessageConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
          const sortedConversations = newMessageConversations.sort((a, b) => {
            if (!a.timestamp && !b.timestamp) return 0;
            if (!a.timestamp) return 1;
            if (!b.timestamp) return -1;
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          });
          const latestConversation = sortedConversations[0];

          return newMessageConversations.length > 0 || totalUnreadCount > 0 ? (
            <div
              className="px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition cursor-pointer"
              onClick={handleMessagesClick}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium text-base text-gray-900">New Messages</div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {totalUnreadCount}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span>Last Message: {latestConversation?.timestamp || 'Unknown'}</span>
                {latestConversation && (
                  <>
                    <span>•</span>
                    <span>
                      {latestConversation.name}
                      {newMessageConversations.length > 1 && (
                        <span className="text-gray-400"> +{newMessageConversations.length - 1} more</span>
                      )}
                    </span>
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
