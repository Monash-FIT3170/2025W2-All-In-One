import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { ApiTask } from "/library-modules/apis/example-tasks/models/ApiTask";
import { MeteorMethodIdentifier } from "/library-modules/apis/core-enums/meteor-method-identifier";
import { TaskDocument } from "/library-modules/database/example-tasks/models/TaskDocument";

export async function apiGetAllTasks(): Promise<ApiTask[]> {
  const fetchedTaskDocuments: TaskDocument[] = await Meteor.callAsync(MeteorMethodIdentifier.TASK_GET_ALL);
  const mappedTasks: ApiTask[] = fetchedTaskDocuments.map(mapTaskDocumentToApiTask);

  return mappedTasks
}

function mapTaskDocumentToApiTask(task: TaskDocument): ApiTask {
  return {
    taskId: task._id,
    text: task.text
  };
}

export async function apiAddNewTask(text: string): Promise<string> {
  const newTask: Mongo.OptionalId<TaskDocument> = {
    text: text
  }
  const taskId: string = await Meteor.callAsync(MeteorMethodIdentifier.TASK_INSERT, newTask); 

  return taskId
}