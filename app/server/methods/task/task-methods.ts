import { get } from "react-hook-form";
import { TaskDocument } from "../../database/task/models/TaskDocument";
import { TaskCollection } from "../../database/task/task-collections";
import { InvalidDataError } from "/app/server/errors/InvalidDataError";
import { ApiTask } from "/app/shared/api-models/task/ApiTask";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { meteorWrappedInvalidDataError } from "/app/server/utils/error-utils";

// This method is used to get a task by its ID
// It returns a promise that resolves to an Apitask object
// If the task is not found, it throws an InvalidDataError
// If there is an error while mapping the task document to DTO, it throws an InvalidDataError
// The method is wrapped in a Meteor method so it can be called from the client
const taskGetMethod = {
  [MeteorMethodIdentifier.TASK_GET]: async (id: string): Promise<ApiTask> => {
    const taskDocument = await getTaskDocumentById(id);

    if (!taskDocument) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(`task with ${id} not found`)
      );
    }

    const taskDTO = await mapTaskDocumentTotaskDTO(taskDocument).catch(
      (error) => {
        throw meteorWrappedInvalidDataError(error);
      }
    );

    return taskDTO;
  },
};
// This method is used to map a task document to an Apitask DTO.
// This function transforms a TaskDocument (raw database document) into an Apitask (structured DTO) for client use. It performs the following steps:
// 1. Fetches the task status document by its ID
// 2. Fetches the latest task price document for the task
// 3. Fetches the task features documents matching the IDs in the task document
// It takes a TaskDocument as input and returns a promise that resolves to an Apitask object
// It fetches the task status, latest task price, and task features documents

async function mapTaskDocumentTotaskDTO(task: TaskDocument): Promise<ApiTask> {
  return {
    taskId: task._id,
    name: task.name,
    status: task.taskStatus,
    createdDate: task.createdDate,
    dueDate: task.dueDate,
    description: task.description,
    priority: task.priority,
  };
}

async function getTaskDocumentById(
  id: string
): Promise<TaskDocument | undefined> {
  return await TaskCollection.findOneAsync(id);
}

Meteor.methods({
  ...taskGetMethod,
});
