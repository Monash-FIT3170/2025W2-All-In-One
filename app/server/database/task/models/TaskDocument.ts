import { TaskStatus } from "/app/shared/task-status-identifier";
import { TaskPriority } from "/app/shared/task-priority-identifier";

export type TaskDocument = {
  _id: string;
  name: string;
  taskStatus: TaskStatus;
  createdDate: Date;
  dueDate: Date;
  description: string;
  priority: TaskPriority;
}