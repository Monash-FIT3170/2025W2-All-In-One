import { TaskStatus } from "/app/shared/task-status-identifier";
export type Task = {
  taskId: string;
  name: string;
  status: TaskStatus;
  createdDate: string;
  dueDate: string;
  description: string;
  priority: string;
};
