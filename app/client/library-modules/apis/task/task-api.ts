import { Meteor } from "meteor/meteor";
import { ApiTask } from "/app/shared/api-models/task/ApiTask";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { TaskPriority } from "/app/shared/task-priority-identifier";
import { Role } from "/app/shared/user-role-identifier";

export async function apiGetTaskById(id: string): Promise<ApiTask> {
  const fetchedTask = await Meteor.callAsync(MeteorMethodIdentifier.TASK_GET, id);

  return fetchedTask;
}

export async function apiCreateTaskForAgent(taskData: {
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  userId: string;
  propertyAddress: string;
  propertyId: string;
}): Promise<string> {
  try {
    const result = await Meteor.callAsync(MeteorMethodIdentifier.TASK_INSERT_FOR_AGENT, taskData);
    return result;
  } catch (error) {
    console.error("Failed to create task:", error);
    throw error;
  }
}


// will update to a universal role apiCreateTask
export async function apiCreateTaskForLandlord(taskData: {
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  userId: string;
  propertyAddress: string;
  propertyId: string;
  userType: Role;
}): Promise<string> {
  try {
    const result = await Meteor.callAsync(MeteorMethodIdentifier.TASK_INSERT_FOR_LANDLORD, taskData);
    return result;
  } catch (error) {
    console.error("Failed to create landlord task:", error);
    throw error;
  }
}