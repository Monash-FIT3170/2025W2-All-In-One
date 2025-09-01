import { apiGetTaskById, apiCreateTaskForAgent, apiCreateTaskForLandlord, apiCreateTask } from "../../../apis/task/task-api";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { mapApiTaskToTask, mapAgentTaskInsertData, mapLandlordTaskInsertData, mapTaskInsertData } from "./mappers/task-mapper";
import { TaskPriority } from "/app/shared/task-priority-identifier"
import { Role } from "/app/shared/user-role-identifier"

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
  const payload = mapLandlordTaskInsertData(task)
  return await apiCreateTaskForLandlord(payload)
}

export async function createTask(task: {
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  userId: string;
  propertyAddress: string;
  propertyId: string;
  userType: Role.AGENT | Role.LANDLORD;
}): Promise<string> {
  const payload = mapTaskInsertData(task)
  return await apiCreateTask(payload)
}