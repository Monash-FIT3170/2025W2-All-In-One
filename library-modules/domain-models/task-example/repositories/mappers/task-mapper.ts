import { DbTask } from "/library-modules/apis/example-tasks/models/DbTask";
import { Task } from "../../Task";

export function mapDbTasksToTasks(tasks: DbTask[]): Task[] {
  return tasks.map((task) => {
    return {
      id: task._id,
      text: task.text
    }
  })
}