import { mapDbTasksToTasks } from "../mappers/task-mapper";
import { addNewTaskToDb, getAllDbTasks } from "../task-api";
import { Task } from "/library-modules/domain-models/task";

export function getAllTasks(): Task[] {
  const dbTasks = getAllDbTasks();
  const mappedTasks = mapDbTasksToTasks(dbTasks)

  return mappedTasks;
}

export function addNewTask(text: string): void {
  addNewTaskToDb(text)
}