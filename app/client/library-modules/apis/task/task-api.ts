import { Meteor } from "meteor/meteor";
import { ApiTask } from "/app/shared/api-models/task/ApiTask";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { TaskPriority } from "/app/shared/task-priority-identifier";


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

export async function apiCreateTaskForLandlord(taskData: {
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  userId: string;
  propertyAddress: string;
  propertyId: string;
}): Promise<string> {
  try {
    const result = await Meteor.callAsync(MeteorMethodIdentifier.TASK_INSERT_FOR_LANDLORD, taskData);
    return result;
  } catch (error) {
    console.error("Failed to create task:", error);
    throw error;
  }
}


// Generic task update function (role-agnostic)
export async function apiUpdateTask(taskData: {
  taskId: string;
  name?: string;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
}): Promise<string> {
  try {
    const result = await Meteor.callAsync(MeteorMethodIdentifier.TASK_UPDATE, taskData);
    return result;
  } catch (error) {
    console.error("Failed to update task:", error);
    throw error;
  }
}


export async function apiDeleteTaskForAgent(taskData: {
  taskId: string;
  agentId: string;
}): Promise<boolean> {
  try {
    const result = await Meteor.callAsync(MeteorMethodIdentifier.TASK_DELETE_FOR_AGENT, taskData);
    return result;
  } catch (error) {
    console.error("Failed to delete agent task:", error);
    throw error;
  }
}

export async function apiDeleteTaskForLandlord(taskData: {
  taskId: string;
  landlordId: string;
}): Promise<boolean> {
  try {
    const result = await Meteor.callAsync(MeteorMethodIdentifier.TASK_DELETE_FOR_LANDLORD, taskData);
    return result;
  } catch (error) {
    console.error("Failed to delete landlord task:", error);
    throw error;
  }
}

export async function apiCreateTaskForTenant(taskData: {
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  userId: string;
  propertyAddress?: string;
  propertyId?: string;
}): Promise<string> {
  try {
    const result = await Meteor.callAsync(MeteorMethodIdentifier.TASK_INSERT_FOR_TENANT, taskData);
    return result;
  } catch (error) {
    console.error("Failed to create tenant task:", error);
    throw error;
  }
}


export async function apiDeleteTaskForTenant(taskData: {
  taskId: string;
  tenantId: string;
}): Promise<boolean> {
  try {
    const result = await Meteor.callAsync(MeteorMethodIdentifier.TASK_DELETE_FOR_TENANT, taskData);
    return result;
  } catch (error) {
    console.error("Failed to delete tenant task:", error);
    throw error;
  }
}
