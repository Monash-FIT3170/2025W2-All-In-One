export type TaskDocument = {
  _id: string;
  name: string;
  status: string;
  createdDate: Date;
  dueDate: Date;
  description: string;
  priority: string;
  user_id: string;
}