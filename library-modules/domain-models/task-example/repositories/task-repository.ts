import { mapDbTasksToTasks } from "./mappers/task-mapper";
import { addNewTaskToDb, getAllDbTasks } from "../../../apis/example-tasks/task-api";
import { Task } from "../Task";

export function getAllTasks(): Task[] {
  const dbTasks = getAllDbTasks();
  const mappedTasks = mapDbTasksToTasks(dbTasks)

  return mappedTasks;
}

export function addNewTask(text: string): void {
  addNewTaskToDb(text)
}