import { ApiTask } from "./models/api-task";
import { TasksCollection } from "./task-collection";

export function getAllApiTasks(): ApiTask[] {
  return TasksCollection.find({}).fetch()
}