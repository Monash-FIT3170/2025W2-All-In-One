import { DbTask } from "../models/DbTask";
import { Task } from "/library-modules/domain-models/task";

export function mapDbTasksToTasks(tasks: DbTask[]): Task[] {
  return tasks.map((task) => {
    return {
      id: task._id,
      text: task.text
    }
  })
}