import { mapApiTasksToTasks } from "../mappers/task-mapper";
import { addNewTaskToDb, getAllApiTasks } from "../task-api";
import { Task } from "/library-modules/domain-models/task";

export function getAllTasks(): Task[] {
  const apiTasks = getAllApiTasks();
  const mappedTasks = mapApiTasksToTasks(apiTasks)

  return mappedTasks;
}

export function addNewTask(text: string): void {
  addNewTaskToDb(text)
}