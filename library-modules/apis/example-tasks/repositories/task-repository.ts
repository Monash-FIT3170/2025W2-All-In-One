import { mapApiTasksToTasks } from "../mappers/task-mapper";
import { getAllApiTasks } from "../task-api";
import { Task } from "/library-modules/domain-models/task";

export function getAllTasks(): Task[] {
  const apiTasks = getAllApiTasks();

  return mapApiTasksToTasks(apiTasks);
}