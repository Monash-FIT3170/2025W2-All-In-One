import { ApiTask } from "/app/shared/api-models/task/ApiTask";
import { Task } from "/app/client/library-modules/domain-models/task/Task";

export function mapApiTasktoTask(task: ApiTask): Task {
  return {
    taskId: task.taskId,
    name: task.name,
    status: task.status,
    createdDate: task.createdDate,
    dueDate: task.dueDate,
    description: task.description,
    priority: task.priority
  }
}


