export type TaskDocument = {
  _id: string;
  name: string;
  task_status_id: string;
  createdDate: Date;
  dueDate: Date;
  description: string;
  priority: string;
}