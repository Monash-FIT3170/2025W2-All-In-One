import React from "react";
import { Link } from "react-router";
import { Button } from "../../theming-shadcn/Button";

interface Task {
  title: string;
  address: string;
  datetime: string;
  status: "Upcoming" | "Due Soon" | "Overdue" | "Pending";
}

interface UpcomingTasksProps {
  tasks: Task[];
  className?: string;
}

export function UpcomingTasks({ tasks, className = "" }: UpcomingTasksProps): React.JSX.Element {
  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
      <p className="text-sm text-gray-500">Your scheduled tasks and appointments</p>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <TaskItem key={index} task={task} />
        ))}
      </div>
      <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
        View All Tasks
      </button>
    </div>
  );
}

function TaskItem({ task }: { task: Task }): React.JSX.Element {
  const getStatusStyle = (status: Task["status"]) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Due Soon":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{task.title}</h3>
          <p className="text-gray-600 text-sm">{task.address}</p>
          <p className="text-gray-500 text-sm mt-1">{task.datetime}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(task.status)}`}>
          {task.status}
        </span>
      </div>
    </div>
  );
}