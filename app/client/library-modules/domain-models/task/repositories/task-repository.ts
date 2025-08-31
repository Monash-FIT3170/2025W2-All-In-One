import { apiGetTaskById } from "../../../apis/task/task-api";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { mapApiTasktoTask } from "./mappers/task-mapper";

export async function getTaskById(id: string): Promise<Task> {
  const apiTask = await apiGetTaskById(id);
  const mappedTask = mapApiTasktoTask(apiTask);

  return mappedTask;
}
