import { Meteor } from "meteor/meteor";
import { TaskDocument } from "../../database/task/models/TaskDocument";
import { TaskCollection } from "../../database/task/task-collections";
import { InvalidDataError } from "/app/server/errors/InvalidDataError";
import { ApiTask } from "/app/shared/api-models/task/ApiTask";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { meteorWrappedInvalidDataError } from "/app/server/utils/error-utils";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { TaskPriority } from "/app/shared/task-priority-identifier";


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
 * Creates a new task for AGENT in the database and returns the task ID.
 *
 * This Meteor method can be called from the client. It performs the following steps:
 * 1. Validates the input data.
 * 2. Creates a new TaskDocument with default values.
 * 3. Inserts the task document into the database.
 * 4. Updates the agent's task_ids array with the new task ID.
 * 5. Returns the ID of the created task.
 *
 * @param taskData - The task data to create
 * @returns A promise that resolves to the task ID string.
 * @throws {InvalidDataError} If the task creation fails.
 */
const taskInsertForAgentMethod = {
  [MeteorMethodIdentifier.TASK_INSERT_FOR_AGENT]: async (taskData: {
    name: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    userId: string;
  }): Promise<string> => {
    console.log("taskInsertForAgentMethod called with:", taskData);

    // Validate required fields - description can be empty
    if (!taskData.name || taskData.name.trim() === "") {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError("Task name is required")
      );
    }

    if (!taskData.dueDate) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError("Due date is required")
      );
    }

    if (!taskData.priority) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError("Priority is required")
      );
    }

    if (!taskData.userId) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError("User ID is required")
      );
    }

    const taskDocument: Omit<TaskDocument, "_id"> = {
      name: taskData.name.trim(),
      description: taskData.description || "", // Handle empty description
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      taskStatus: TaskStatus.NOTSTARTED, // Default status
      createdDate: new Date(),
    };

    try {
      const insertedId = await TaskCollection.insertAsync(taskDocument);
      const createdTask = await getTaskDocumentById(insertedId);

      if (!createdTask) {
        throw new InvalidDataError("Failed to retrieve created task");
      }

      // Update the agent's task_ids array to include the new task
      try {
        await Meteor.callAsync(MeteorMethodIdentifier.AGENT_UPDATE_TASKS, taskData.userId, insertedId);
        console.log("Agent task_ids updated successfully");
      } catch (agentError) {
        console.warn("Failed to update agent task_ids:", agentError);
        // Don't fail the task creation if agent update fails - task was already created
      }

      return insertedId;
    } catch (error) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(`Failed to create task: ${error}`)
      );
    }
  },
};

/**
 * Creates a new task for LANDLORD in the database and returns the task ID.
 * */

const taskInsertForLandlordMethod = {
  [MeteorMethodIdentifier.TASK_INSERT_FOR_LANDLORD]: async (taskData: {
    name: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    landlordId: string;
  }): Promise<string> => {
    console.log("taskInsertForLandlordMethod called with:", taskData);

    // Validate required fields
    if (!taskData.name || taskData.name.trim() === "") {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError("Task name is required")
      );
    }

    if (!taskData.dueDate) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError("Due date is required")
      );
    }

    if (!taskData.priority) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError("Priority is required")
      );
    }

    if (!taskData.landlordId) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError("Landlord ID is required")
      );
    }

    const taskDocument: Omit<TaskDocument, "_id"> = {
      name: taskData.name.trim(),
      description: taskData.description || "",
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      taskStatus: TaskStatus.NOTSTARTED,
      createdDate: new Date(),
    };

    try {
      const insertedId = await TaskCollection.insertAsync(taskDocument);
      const createdTask = await getTaskDocumentById(insertedId);

      if (!createdTask) {
        throw new InvalidDataError("Failed to retrieve created task");
      }

      try {
        await Meteor.callAsync(MeteorMethodIdentifier.LANDLORD_UPDATE_TASKS, taskData.landlordId, insertedId);
        console.log("Landlord task_ids updated successfully");
      } catch (landlordError) {
        console.error("Landlord not found for ID:", taskData.landlordId);
        throw new Error("Landlord not found - cannot send tenant application");
      }

      return insertedId;
    } catch (error) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(`Failed to create task: ${error}`)
      );
    }
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
  ...taskInsertForAgentMethod,
  ...taskInsertForLandlordMethod
});
