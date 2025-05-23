import React, { useEffect, useState } from "react";
import { CardWidget } from "./CardWidget";
import { Button } from "../../theming-shadcn/Button";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiTask } from "/app/shared/api-models/task/ApiTask";

interface Task {
  title: string;
  address: string;
  datetime: string;
  status: "Upcoming" | "Due Soon" | "Overdue" | "Completed";
}

interface UpcomingTasksProps {
  taskIds: string[];
  className?: string;
}

export function UpcomingTasks({
  taskIds,
  className = "",
}: UpcomingTasksProps): React.JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      if (!taskIds || taskIds.length === 0) {
        setTasks([]);
        return;
      }

      try {
        // Fetch all tasks in one go
        const apiTasks = await Meteor.callAsync(
          MeteorMethodIdentifier.TASK_GET_MULTIPLE,
          taskIds
        );

        // Transform ApiTasks to the format needed by the UI
        const transformedTasks = apiTasks.map((task: ApiTask) => ({
          title: task.name,
          address: task.description,
          datetime: new Date(task.dueDate).toLocaleDateString(),
          status: task.status === "completed"
            ? "Completed"
            : new Date(task.dueDate) < new Date()
            ? "Overdue"
            : new Date(task.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            ? "Due Soon"
            : "Upcoming",
        }));

        setTasks(transformedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      }
    }

    fetchTasks();
  }, [taskIds]);

  return (
    <CardWidget
      title="Upcoming Tasks"
      value=""
      subtitle="Your scheduled tasks and appointments"
      className={className}
    >
      <div className="mt-4 space-y-4">
        {tasks.map((task, index) => (
          <TaskItem key={index} task={task} />
        ))}
      </div>
      <div className="mt-4">
        <Button variant="ghost" className="w-full">
          View All Tasks
        </Button>
      </div>
    </CardWidget>
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
      case "Completed":
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{task.title}</h3>
          <p className="text-gray-600 text-sm">{task.address}</p>
          <p className="text-gray-500 text-sm mt-1">{task.datetime}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>
    </div>
  );
}
