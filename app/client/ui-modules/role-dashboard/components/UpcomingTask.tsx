import React, { useEffect, useState } from "react";
import { CardWidget } from "./CardWidget";
import { Button } from "../../theming-shadcn/Button";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { parse, format, isToday, isTomorrow, compareAsc } from "date-fns";
import { Task } from "/app/client/library-modules/domain-models/task/Task";


export function UpcomingTasks(props: {tasks:Task[]}): React.JSX.Element {
  // Transform tasks and sort by date
  const transformedTasks: Task[] = props.tasks
    .filter((task) => task.status !== TaskStatus.COMPLETED) // Filter out completed tasks};
    .sort((a, b) => {
      const dateA = parse(a.dueDate, "dd/MM/yyyy", new Date());
      const dateB = parse(b.dueDate, "dd/MM/yyyy", new Date());
      return compareAsc(dateB, dateA); // Descending orderc
    });

  return (
    <CardWidget
      title="Upcoming Tasks"
      value=""
      subtitle="Your scheduled tasks and appointments"
    >
      <div className="mt-4 space-y-4">
        {transformedTasks.length > 0 ? (
          transformedTasks.map((task, index) => (
            <TaskItem key={task.taskId} task={task} />
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
  const isOverdue = new Date(task.dueDate) < new Date()

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{task.name}</h3>
          <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
              task.status
            )}`}
          >
            {task.status}
          </span>
          { isOverdue && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Overdue</span>)}
          </div>
        </div>
        {task.description && (
          <p className="text-gray-600 text-sm">{task.description}</p>
        )}
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-base">Due: {task.dueDate}</span>
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
