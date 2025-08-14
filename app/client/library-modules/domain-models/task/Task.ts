import { TaskStatus } from "/app/shared/task-status-identifier";
import { TaskPriority } from "/app/shared/task-priority-identifier";

export type Task = {
  taskId: string;
  name: string;
  status: TaskStatus;
  createdDate: string;
  dueDate: string;
  description: string;
  priority: TaskPriority;
  propertyAddress: string;
  propertyId?: string; 
};
