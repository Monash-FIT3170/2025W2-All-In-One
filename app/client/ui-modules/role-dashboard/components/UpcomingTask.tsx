import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../../store";
import { CardWidget } from "./CardWidget";
import { Button } from "../../theming-shadcn/Button";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { parse, format, isToday, isTomorrow, compareAsc } from "date-fns";
import { Role } from "/app/shared/user-role-identifier";
import { NavigationPath } from "../../../navigation";

interface Task {
  title: string;
  datetime: string;
  status: string;
  description?: string;
  priority?: string;
  taskId?: string;
}

interface UpcomingTasksProps {
  tasks: Task[];
  className?: string;
  currentUser?: {
    role?: string;
  };
}

export function UpcomingTasks({
  tasks,
  className = "",
  currentUser
}: UpcomingTasksProps): React.JSX.Element {
  const navigate = useNavigate()

  // Transform tasks and sort by date
  const transformedTasks = tasks
    .filter((task) => task.status !== TaskStatus.COMPLETED) // Filter out completed tasks
    .map((task) => {
      // Parse the datetime string (assuming DD/MM/YYYY format)
      const dueDate = parse(task.datetime, "dd/MM/yyyy", new Date());

      // Format the date to match the design
      const formattedDate = formatTaskDate(dueDate);

      return {
        ...task,
        datetime: formattedDate,
      };
    })
    .sort((a, b) => {
      const dateA = parse(a.datetime, "dd/MM/yyyy", new Date());
      const dateB = parse(b.datetime, "dd/MM/yyyy", new Date());
      return compareAsc(dateA, dateB);
    });
  const handleViewAllTasks = () => {
    const role = currentUser?.role;

    if (!role) {
      console.warn("No user role found");
      return;
    }

    // Role to calendar path mapping - automatically handles new roles
    const roleToCalendarMap: Record<string, string> = {
      [Role.AGENT]: NavigationPath.AgentCalendar,
      [Role.LANDLORD]: NavigationPath.LandlordCalendar,
      [Role.TENANT]: NavigationPath.TenantCalendar,
    };

    const calendarPath = roleToCalendarMap[role];

    if (calendarPath) {
      navigate(calendarPath);
    } else {
      console.warn(`No calendar path defined for role: ${role}`);
    }
  };


  return (
    <CardWidget
      title="Upcoming Tasks"
      value=""
      subtitle="Your scheduled tasks and appointments"
      className={className}
    >
      <div className="mt-4 space-y-4">
        {transformedTasks.length > 0 ? (
          transformedTasks.map((task, index) => (
            <TaskItem key={task.taskId || index} task={task} />
          ))
        ) : (
          <div className="text-center text-gray-500">No upcoming tasks</div>
        )}
      </div>
      <div className="mt-4">
        <Button variant="ghost" className="w-full py-3 border-transparent rounded-lg text-center hover:bg-gray-50 transition-colors" onClick={handleViewAllTasks}>
          View All Tasks
        </Button>
      </div>
    </CardWidget>
  );
}

// Helper function to format date using date-fns
function formatTaskDate(date: Date): string {
  if (!date || isNaN(date.getTime())) {
    return "Invalid Date";
  }

  if (isTomorrow(date)) {
    return `Tomorrow, ${format(date, "h:mm a")}`;
  }

  // Format as "MMM d, h:mm a" (e.g., "May 19, 2:30 PM")
  return format(date, "MMM d, h:mm a");
}

function TaskItem({ task }: { task: Task }): React.JSX.Element {
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

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
              task.status
            )}`}
          >
            {task.status}
          </span>
        </div>
        {task.description && (
          <p className="text-gray-600 text-sm">{task.description}</p>
        )}
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-base">{task.datetime}</span>
          {task.priority && (
            <>
              <span className="text-gray-400">•</span>
              <span>Priority: {task.priority}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
