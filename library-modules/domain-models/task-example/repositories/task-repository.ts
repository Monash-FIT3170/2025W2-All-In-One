import { mapApiTasksToTasks } from "./mappers/task-mapper";
import { apiAddNewTask, apiGetAllTasks } from "../../../apis/example-tasks/task-api";
import { Task } from "../Task";

export async function getAllTasks(): Promise<Task[]> {
  const dbTasks = await apiGetAllTasks();
  const mappedTasks = mapApiTasksToTasks(dbTasks)

  return mappedTasks;
}

export async function addNewTask(text: string): Promise<string> {
  return apiAddNewTask(text)
}