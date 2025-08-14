import { ApiTask } from "/app/shared/api-models/task/ApiTask";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { getISODate } from "/app/client/library-modules/utils/date-utils";

export function mapApiTasktoTask(task: ApiTask): Task {
  return {
    taskId: task.taskId,
    name: task.name,
    status: task.status as TaskStatus,
    createdDate: getISODate(task.createdDate),
    dueDate: getISODate(task.dueDate),
    description: task.description,
    priority: task.priority,
    propertyAddress: task.propertyAddress,
    propertyId: task.propertyId, // Optional property ID
  };
}
