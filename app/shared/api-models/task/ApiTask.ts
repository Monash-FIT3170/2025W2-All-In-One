import { TaskPriority } from "/app/shared/task-priority-identifier";

export type ApiTask = {
  taskId: string;
  name: string;
  status: string;
  createdDate: Date;
  dueDate: Date;
  description: string;
  priority: TaskPriority;
}