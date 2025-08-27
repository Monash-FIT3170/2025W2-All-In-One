import { Meteor } from "meteor/meteor";
import { ApiTask } from "/app/shared/api-models/task/ApiTask";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { TaskPriority } from "/app/shared/task-priority-identifier";
import { Role } from "/app/shared/user-role-identifier";

export async function apiGetTaskById(id: string): Promise<ApiTask> {
  const fetchedTask = await Meteor.callAsync(MeteorMethodIdentifier.TASK_GET, id);

  return fetchedTask;
}

export type CreateTaskPayload = {
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  propertyAddress: string;
  propertyId: string;
  userId: string;
  userType: Role.AGENT | Role.LANDLORD;
};

export async function apiCreateTask(taskData: CreateTaskPayload): Promise<string> {
  return await Meteor.callAsync(MeteorMethodIdentifier.TASK_INSERT, taskData);
}

// Optional thin wrappers for callers migrating gradually
export async function apiCreateTaskForAgent(taskData: {
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  userId: string;
  propertyAddress: string;
  propertyId: string;
}): Promise<string> {
  return apiCreateTask({
    name: taskData.name,
    description: taskData.description,
    dueDate: taskData.dueDate,
    priority: taskData.priority,
    propertyAddress: taskData.propertyAddress,
    propertyId: taskData.propertyId,
    userType: Role.AGENT,
    userId: taskData.userId,
  });
}