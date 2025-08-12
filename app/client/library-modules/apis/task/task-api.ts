import { Meteor } from "meteor/meteor";
import { ApiTask } from "/app/shared/api-models/task/ApiTask";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { TaskPriority } from "/app/shared/task-priority-identifier";

export async function apiGetTaskById(id: string): Promise<ApiTask> {
  const fetchedTask = await Meteor.callAsync(MeteorMethodIdentifier.TASK_GET, id);

  return fetchedTask;
}

export async function apiCreateTask(taskData: {
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  userId: string;
  property: string;
  propertyId: string; // Optional property ID
}): Promise<string> {
  try {
    const result = await Meteor.callAsync(MeteorMethodIdentifier.TASK_INSERT, taskData);
    return result;
  } catch (error) {
    console.error("Failed to create task:", error);
    throw error;
  }
}