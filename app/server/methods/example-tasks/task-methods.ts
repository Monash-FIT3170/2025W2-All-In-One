import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { Task } from "../../database/example-tasks/models/Task";
import { TasksCollection } from "/app/server/database/example-tasks/TasksCollection";
import { ApiTask } from "../../../shared/api-models/example-tasks/ApiTask";

const taskInsertMethod = {
  [MeteorMethodIdentifier.TASK_INSERT]: async (text: string): Promise<string> => {
    const newTask: Mongo.OptionalId<Task> = {
      text: text
    }
    return await TasksCollection.insertAsync(newTask);
  }
}

const taskGetAllMethod = {
  [MeteorMethodIdentifier.TASK_GET_ALL]: async (): Promise<ApiTask[]> => {
    const fetchedTaskDocuments = await TasksCollection.find({}).fetchAsync();
    const mappedTasks = fetchedTaskDocuments.map(mapTaskDocumentToTaskDTO)

    return mappedTasks
  }
}

function mapTaskDocumentToTaskDTO(task: Task): ApiTask {
  return {
    taskId: task._id,
    text: task.text
  };
}

Meteor.methods({
  ...taskInsertMethod,
  ...taskGetAllMethod
});