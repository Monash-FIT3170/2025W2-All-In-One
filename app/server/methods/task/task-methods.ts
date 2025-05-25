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
    // Debug: Log all tasks in collection
    const allTasks = await TaskCollection.find().fetchAsync();
    console.log("All tasks in collection:", allTasks);
    
    const taskDocument = await getTaskDocumentById(id);
    console.log("Looking for task with id:", id);
    console.log("Found task document:", taskDocument);

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
  return await TaskCollection.findOneAsync({ _id: id });
}

Meteor.methods({
  ...taskGetMethod,
});
