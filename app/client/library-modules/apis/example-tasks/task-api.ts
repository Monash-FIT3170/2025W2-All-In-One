import { Meteor } from "meteor/meteor";
import { ApiTask } from "/app/client/library-modules/apis/example-tasks/models/ApiTask";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

export async function apiGetAllTasks(): Promise<ApiTask[]> {
  const fetchedTasks: ApiTask[] = await Meteor.callAsync(
    MeteorMethodIdentifier.TASK_GET_ALL
  );

  return fetchedTasks;
}

export async function apiAddNewTask(text: string): Promise<string> {
  const taskId: string = await Meteor.callAsync(
    MeteorMethodIdentifier.TASK_INSERT,
    text
  );

  return taskId;
}
