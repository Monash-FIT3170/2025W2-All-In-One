import { TaskStatus } from "/app/shared/task-status-identifier";
export type TaskDocument = {
  _id: string;
  name: string;
  taskStatus: TaskStatus;
  createdDate: Date;
  dueDate: Date;
  description: string;
  priority: string;
}