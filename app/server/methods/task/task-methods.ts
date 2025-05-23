import { get } from "react-hook-form";
import { TaskDocument } from "../../database/task/models/TaskDocument";
import { TaskCollection } from "../../database/task/task-collections";
import { InvalidDataError } from "/app/server/errors/InvalidDataError";
import { ApiTask } from "/app/shared/api-models/task/ApiTask";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { meteorWrappedInvalidDataError } from "/app/server/utils/error-utils";

/**
 * Retrieves a task by its ID and returns it as an `ApiTask` DTO.
 *
 * This Meteor method can be called from the client. It performs the following steps:
 * 1. Fetches the task document from the database using the provided ID.
 * 2. Throws an `InvalidDataError` if the task is not found.
 * 3. Maps the task document to an `ApiTask` DTO using `mapTaskDocumentTotaskDTO`.
 * 4. Throws an `InvalidDataError` if there is an error during mapping.
 *
 * @param id - The unique identifier of the task to retrieve.
 * @returns A promise that resolves to an `ApiTask` object.
 * @throws {InvalidDataError} If the task is not found or mapping fails.
 */
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

/**
 * Retrieves multiple tasks by their IDs and returns them as ApiTask DTOs.
 *
 * This Meteor method can be called from the client. It performs the following steps:
 * 1. Fetches all task documents from the database using the provided IDs.
 * 2. Maps each task document to an ApiTask DTO.
 * 3. Returns an array of ApiTask objects.
 *
 * @param taskIds - Array of task IDs to retrieve.
 * @returns A promise that resolves to an array of ApiTask objects.
 */
const taskGetMultipleMethod = {
  [MeteorMethodIdentifier.TASK_GET_MULTIPLE]: async (
    taskIds: string[]
  ): Promise<ApiTask[]> => {
    if (!taskIds || taskIds.length === 0) {
      return [];
    }

    const taskDocuments = await TaskCollection.find(
      { _id: { $in: taskIds } }
    ).fetchAsync();

    const taskDTOs = await Promise.all(
      taskDocuments.map((doc) => mapTaskDocumentTotaskDTO(doc))
    );

    return taskDTOs;
  },
};

/**
 * Maps a TaskDocument to an ApiTask DTO.
 *
 * This function transforms a TaskDocument (raw database document) into an ApiTask (structured DTO) for client use.
 * It extracts relevant fields from the TaskDocument and constructs an ApiTask object.
 *
 * @param task - The TaskDocument to be mapped.
 * @returns A promise that resolves to an ApiTask object.
 */
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
  ...taskGetMultipleMethod,
});
