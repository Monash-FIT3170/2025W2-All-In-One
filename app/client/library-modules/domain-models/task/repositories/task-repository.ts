import { apiGetTaskById, apiCreateTaskForTenant, apiUpdateTaskForTenant, apiCreateTaskForAgent, apiCreateTaskForLandlord, apiUpdateTask } from "../../../apis/task/task-api";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { mapApiTaskToTask, mapAgentTaskInsertData, mapLandlordTaskInsertData, mapTenantTaskInsertData } from "./mappers/task-mapper";
import { TaskPriority } from "/app/shared/task-priority-identifier"
import { TaskData } from "../../../../ui-modules/role-dashboard/agent-dashboard/components/TaskFormSchema"

export async function getTaskById(id: string): Promise<Task> {
  const apiTask = await apiGetTaskById(id);
  const mappedTask = mapApiTaskToTask(apiTask);

  return mappedTask;
}

export async function createTaskForAgent(task: {
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  userId: string;
  propertyAddress: string;
  propertyId: string;
}): Promise<string> {
  const payload = mapAgentTaskInsertData(task)
  return await apiCreateTaskForAgent(payload)
}

export async function createTaskForLandlord(task: {
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  userId: string;
  propertyAddress: string;
  propertyId: string;
}): Promise<string> {
  const payload = mapLandlordTaskInsertData(task);
  return await apiCreateTaskForLandlord(payload);
}

export async function createTaskForTenant(task: {
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  userId: string;
  propertyAddress: string;
  propertyId: string;
}): Promise<string> {
  const payload = mapTenantTaskInsertData(task);
  return await apiCreateTaskForTenant(payload);
}

export async function updateTaskForAgent(task: {
  taskId: string;
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
}): Promise<string> {
  return await apiUpdateTask(task);
}

export async function updateTaskForLandlord(task: {
  taskId: string;
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
}): Promise<string> {
  return await apiUpdateTaskForLandlord(task);
}

export async function updateTaskForTenant(task: {
  taskId: string;
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
}): Promise<string> {
  return await apiUpdateTaskForTenant(task);
}

// temp fix ---> will need to update in M4
export async function createTaskForLandlordOnCalendar(
  taskData: TaskData,
  userId: string
): Promise<string> {
  const apiData = {
    ...taskData,
    userId, // add userId
    dueDate: new Date(taskData.dueDate), // ensure date is Date type
    propertyId: taskData.propertyId || "", // default if missing
  };

  const createdTaskId = await apiCreateTaskForLandlord(apiData);
  return createdTaskId;
}