import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { TaskDocument } from "/app/server/database/example-tasks/models/TaskDocument";
import { TasksCollection } from "/app/server/database/example-tasks/TasksCollection";
import { TaskDTO } from "./models/TaskDTO";

const taskInsertMethod = {
  [MeteorMethodIdentifier.TASK_INSERT]: async (text: string): Promise<string> => {
    const newTask: Mongo.OptionalId<TaskDocument> = {
      text: text
    }
    return await TasksCollection.insertAsync(newTask);
  }
}

const taskGetAllMethod = {
  [MeteorMethodIdentifier.TASK_GET_ALL]: async (): Promise<TaskDTO[]> => {
    const fetchedTaskDocuments = await TasksCollection.find({}).fetchAsync();
    const mappedTasks = fetchedTaskDocuments.map(mapTaskDocumentToTaskDTO)

    return mappedTasks
  }
}

function mapTaskDocumentToTaskDTO(task: TaskDocument): TaskDTO {
  return {
    taskId: task._id,
    text: task.text
  };
}

Meteor.methods({
  ...taskInsertMethod,
  ...taskGetAllMethod
});