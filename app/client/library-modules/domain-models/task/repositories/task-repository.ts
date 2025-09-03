import { apiGetTaskById } from "../../../apis/task/task-api";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { mapApiTasktoTask } from "./mappers/task-mapper";
import { apiCreateTaskForLandlord } from "../../../apis/task/task-api";
import { TaskData } from "../../../../ui-modules/role-dashboard/agent-dashboard/components/TaskFormSchema"

export async function getTaskById(id: string): Promise<Task> {
  const apiTask = await apiGetTaskById(id);
  const mappedTask = mapApiTasktoTask(apiTask);

  return mappedTask;
}

export async function createTaskForLandlord(
  taskData: TaskData,
  userId: string
): Promise<string> {
  const apiData = {
    ...taskData,
    userId, // add userId
    dueDate: new Date(taskData.dueDate), // ensure date is Date type
    propertyId: taskData.propertyId || "", // default if missing
  };

  const createdTaskId = await apiCreateTaskForLandlord(apiData);
  return createdTaskId;
}