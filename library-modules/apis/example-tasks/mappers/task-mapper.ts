import { ApiTask } from "../models/api-task";
import { Task } from "/library-modules/domain-models/task";

export function mapApiTasksToTasks(tasks: ApiTask[]): Task[] {
  return tasks.map((task) => {
    return {
      id: task._id,
      text: task.text
    }
  })
}