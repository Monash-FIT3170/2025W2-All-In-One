import { mapDbTasksToTasks } from "./mappers/task-mapper";
import { addNewTaskToDb, getAllDbTasks } from "../../../apis/example-tasks/task-api";
import { Task } from "../Task";

export async function getAllTasks(): Promise<Task[]> {
  const dbTasks = await getAllDbTasks();
  const mappedTasks = mapDbTasksToTasks(dbTasks)

  return mappedTasks;
}

export async function addNewTask(text: string): Promise<string> {
  return addNewTaskToDb(text)
}