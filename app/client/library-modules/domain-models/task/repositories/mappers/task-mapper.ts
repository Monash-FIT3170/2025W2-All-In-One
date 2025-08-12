import { ApiTask } from "/app/shared/api-models/task/ApiTask";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { TaskStatus } from "/app/shared/task-status-identifier";

export function mapApiTasktoTask(task: ApiTask): Task {
  return {
    taskId: task.taskId,
    name: task.name,
    status: task.status as TaskStatus,
    createdDate: task.createdDate.toISOString().slice(0, 10), // Format to YYYY-MM-DD
    dueDate: task.dueDate.toISOString().slice(0, 10), // Format to YYYY-MM-DD
    description: task.description,
    priority: task.priority,
    property: task.property,
    propertyId: task.propertyId, // Optional property ID
  };
}
