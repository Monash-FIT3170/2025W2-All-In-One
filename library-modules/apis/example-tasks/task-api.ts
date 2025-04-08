import { ApiTask } from "./models/api-task";
import { TasksCollection } from "./task-collections";

export function getAllApiTasks(): ApiTask[] {
  return TasksCollection.find({}).fetch()
}