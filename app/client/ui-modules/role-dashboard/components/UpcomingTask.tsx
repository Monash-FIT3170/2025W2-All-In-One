import React, { useEffect, useState } from "react";
import { CardWidget } from "./CardWidget";
import { Button } from "../../theming-shadcn/Button";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiTask } from "/app/shared/api-models/task/ApiTask";
import { TaskStatus } from "/app/shared/task-status-identifier";

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
}

// Helper function to parse date in DD/MM/YYYY format
function parseDateString(dateStr: string): Date {
  // Check if the date is in DD/MM/YYYY format
  const ddmmyyyyMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [_, day, month, year] = ddmmyyyyMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  // If not in DD/MM/YYYY format, try standard date parsing
  return new Date(dateStr);
}

export function UpcomingTasks({
  tasks,
  className = "",
}: UpcomingTasksProps): React.JSX.Element {
  console.log(tasks);

  // Get current date at midnight UTC
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);

  // Transform tasks and sort by date
  const transformedTasks = tasks
    .filter((task) => task.status !== TaskStatus.COMPLETED) // Filter out completed tasks
    .map((task) => {
      // Parse the datetime string using our custom parser
      const dueDate = parseDateString(task.datetime);

      let status: Task["status"];
      if (dueDate.getTime() < now.getTime()) {
        status = "Overdue";
      } else if (dueDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
        status = "Due Soon";
      } else {
        status = "Upcoming";
      }

      // Format the date to match the screenshot
      const formattedDate = formatDate(dueDate);

      return {
        title: task.title,
        datetime: formattedDate,
        status,
        description: task.description,
        priority: task.priority,
        taskId: task.taskId,
      };
    })
    .sort((a, b) => {
      const dateA = parseDateString(a.datetime);
      const dateB = parseDateString(b.datetime);
      return dateA.getTime() - dateB.getTime();
    });
  console.log(transformedTasks);

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
        <Button variant="ghost" className="w-full">
          View All Tasks
        </Button>
      </div>
    </CardWidget>
  );
}

// Helper function to format date like "April 1, 11:59 PM" or "Tomorrow, 10:00 AM" or "Mar 28, 3:30 PM"
function formatDate(date: Date): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  // Check if it's tomorrow
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  // For dates in the current year
  const options: Intl.DateTimeFormatOptions = {
    month: date.getMonth() === now.getMonth() ? "long" : "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  return date.toLocaleString("en-US", options);
}

function TaskItem({ task }: { task: Task }): React.JSX.Element {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "due soon":
        return "bg-yellow-50 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
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
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-base">{task.datetime}</span>
          {task.priority && (
            <>
              <span>•</span>
              <span>Priority: {task.priority}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
