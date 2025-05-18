import { TaskStatus } from "/app/shared/task-status-identifier";
export type Task = {
  taskId: string;
  name: string;
  status: TaskStatus;
  createdDate: Date;
  dueDate: Date;
  description: string;
  priority: string;
};
