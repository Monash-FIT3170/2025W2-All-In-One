import { ApiTask } from "/app/shared/api-models/task/ApiTask";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { getISODate } from "/app/client/library-modules/utils/date-utils";
import { TaskPriority } from "/app/shared/task-priority-identifier"
import { Role } from "/app/shared/user-role-identifier"

export function mapApiTaskToTask(task: ApiTask): Task {
  return {
    taskId: task.taskId,
    name: task.name,
    status: task.status as TaskStatus,
    createdDate: getISODate(task.createdDate),
    dueDate: getISODate(task.dueDate),
    description: task.description,
    priority: task.priority,
    propertyAddress: task.propertyAddress,
    propertyId: task.propertyId,
  };
}

export function mapAgentTaskInsertData(task: {
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  userId: string;
  propertyAddress: string;
  propertyId: string;
}) {
  return {
    name: task.name,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    propertyAddress: task.propertyAddress,
    propertyId: task.propertyId,
    userId: task.userId,
    userType: Role.AGENT,
  }
}

export function mapLandlordTaskInsertData(task: {
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  userId: string;
  propertyAddress: string;
  propertyId: string;
}) {
  return {
    name: task.name,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    landlordId: task.userId, // Map userId to landlordId for the server
  }
}