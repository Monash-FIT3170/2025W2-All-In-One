import { Meteor } from "meteor/meteor";
import { TaskDocument } from "../../database/task/models/TaskDocument";
import { TaskCollection } from "../../database/task/task-collections";
import { AgentCollection, LandlordCollection, TenantCollection } from "../../database/user/user-collections";
import { InvalidDataError } from "/app/server/errors/InvalidDataError";
import { ApiTask } from "/app/shared/api-models/task/ApiTask";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { meteorWrappedInvalidDataError } from "/app/server/utils/error-utils";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { TaskPriority } from "/app/shared/task-priority-identifier";

type TaskUpdateData = {
  name?: string;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
};
/**
 * Retrieves a task by its ID and returns it as an `ApiTask` DTO.
 *
 * This Meteor method can be called from the client. It performs the following steps:
 * 1. Fetches the task document from the database using the provided ID.
 * 2. Throws an `InvalidDataError` if the task is not found.
 * 3. Maps the task document to an `ApiTask` DTO using `mapTaskDocumentToTaskDTO`.
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

    const taskDTO = await mapTaskDocumentToTaskDTO(taskDocument).catch(
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
    propertyAddress: string;
    propertyId: string;
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
      taskPropertyAddress: taskData.propertyAddress,
      taskPropertyId: taskData.propertyId,
      taskStatus: TaskStatus.NOTSTARTED, // Default status
      createdDate: new Date(),
    };

    try {
      const insertedId = await TaskCollection.insertAsync(taskDocument);
      const createdTask = await getTaskDocumentById(insertedId);

      if (!createdTask) {
        throw new InvalidDataError("Failed to retrieve created task");
      }

      // Add the task to the agent's task_ids array
      console.log("Before agent add task call");
      try {
        await Meteor.callAsync(
          MeteorMethodIdentifier.AGENT_ADD_TASK,
          taskData.userId,
          insertedId
        );
        console.log("Agent task_ids updated successfully");
      } catch (agentError) {
        console.error("Failed to add task to agent:", agentError);
        throw meteorWrappedInvalidDataError(
          new InvalidDataError(`Failed to add task to agent: ${agentError}`)
        );
      }
      console.log("After agent add task call");

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
    propertyAddress: string;
    propertyId: string;
    userId: string;
  }): Promise<string> => {
    console.log("taskInsertForLandlordMethod called with:", taskData);

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
      taskPropertyAddress: taskData.propertyAddress,
      taskPropertyId: taskData.propertyId,
      taskStatus: TaskStatus.NOTSTARTED, // Default status
      createdDate: new Date(),
    };

    try {
      const insertedId = await TaskCollection.insertAsync(taskDocument);
      const createdTask = await getTaskDocumentById(insertedId);

      if (!createdTask) {
        throw new InvalidDataError("Failed to retrieve created task");
      }

      // Add the task to the landlord's task_ids array
      console.log("Before landlord add task call");
      try {
        await Meteor.callAsync(
          MeteorMethodIdentifier.LANDLORD_ADD_TASK,
          taskData.userId,
          insertedId
        );
        console.log("Landlord task_ids updated successfully");
      } catch (landlordError) {
        console.error("Failed to add task to landlord:", landlordError);
        throw meteorWrappedInvalidDataError(
          new InvalidDataError(`Failed to add task to landlord: ${landlordError}`)
        );
      }
      console.log("After landlord add task call");

      return insertedId;
    } catch (error) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(`Failed to create task: ${error}`)
      );
    }
  },
};

/**
 * Creates a new task for TENANT in the database and returns the task ID.
 */
const taskInsertForTenantMethod = {
  [MeteorMethodIdentifier.TASK_INSERT_FOR_TENANT]: async (taskData: {
    name: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    userId: string;
    propertyAddress?: string;
    propertyId?: string;
  }): Promise<string> => {
    console.log("taskInsertForTenantMethod called with:", taskData);

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
      taskPropertyAddress: taskData.propertyAddress || "",
      taskPropertyId: taskData.propertyId || "",
      taskStatus: TaskStatus.NOTSTARTED, // Default status
      createdDate: new Date(),
    };

    try {
      const insertedId = await TaskCollection.insertAsync(taskDocument);
      const createdTask = await getTaskDocumentById(insertedId);

      if (!createdTask) {
        throw new InvalidDataError("Failed to retrieve created task");
      }

      // Add the task to the tenant's task_ids array
      console.log("Before tenant add task call for task:", insertedId, "userId:", taskData.userId);
      try {
        await Meteor.call(
          MeteorMethodIdentifier.TENANT_ADD_TASK,
          taskData.userId,
          insertedId
        );
        
      } catch (tenantError) {
        
        throw meteorWrappedInvalidDataError(
          new InvalidDataError(`Failed to add task to tenant: ${tenantError}`)
        );
      }
      console.log("After tenant add task call");

      return insertedId;
    } catch (error) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(`Failed to create task: ${error}`)
      );
    }
  },
};

/**
 * Updates an existing task in the database and returns the task ID.
 * This method is role-agnostic since it only modifies task data, not user relationships.
 */
const taskUpdateMethod = {
  [MeteorMethodIdentifier.TASK_UPDATE]: async (taskData: {
    taskId: string;
    name?: string;
    description?: string;
    dueDate?: Date;
    priority?: TaskPriority;
  }): Promise<string> => {
    console.log("taskUpdateMethod called with:", taskData);

    // Validate required fields
    if (!taskData.taskId) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError("Task ID is required")
      );
    }

    const updateData: TaskUpdateData = {};

    if (taskData.name !== undefined) {
      updateData.name = taskData.name.trim();
    }
    if (taskData.description !== undefined) {
      updateData.description = taskData.description;
    }
    if (taskData.dueDate !== undefined) {
      updateData.dueDate = taskData.dueDate;
    }
    if (taskData.priority !== undefined) {
      updateData.priority = taskData.priority;
    }

    try {
      const result = await TaskCollection.updateAsync(
        { _id: taskData.taskId },
        { $set: updateData }
      );

      if (result === 0) {
        throw new InvalidDataError("Task not found");
      }

      return taskData.taskId;
    } catch (error) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(`Failed to update task: ${error}`)
      );
    }
  },
};

/**
 * Deletes a task for AGENT from the database and removes it from the agent's task list.
 */
const taskDeleteForAgentMethod = {
  [MeteorMethodIdentifier.TASK_DELETE_FOR_AGENT]: async (taskData: {
    taskId: string;
    agentId: string;
  }): Promise<boolean> => {
    console.log("taskDeleteForAgentMethod called with:", taskData);

    // Validate required fields
    if (!taskData.taskId || !taskData.agentId) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError("Task ID and Agent ID are required")
      );
    }

    try {
      // Delete the task from the task collection
      const deleteResult = await TaskCollection.removeAsync({ _id: taskData.taskId });
      
      if (deleteResult === 0) {
        throw new InvalidDataError("Task not found");
      }

      // Remove the task from the agent's task_ids array using atomic $pull operation
      await AgentCollection.updateAsync(
        { _id: taskData.agentId },
        { $pull: { task_ids: taskData.taskId } }
      );

      return true;
    } catch (error) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(`Failed to delete task: ${error}`)
      );
    }
  },
};

/**
 * Deletes a task for LANDLORD from the database and removes it from the landlord's task list.
 */
const taskDeleteForLandlordMethod = {
  [MeteorMethodIdentifier.TASK_DELETE_FOR_LANDLORD]: async (taskData: {
    taskId: string;
    landlordId: string;
  }): Promise<boolean> => {
    console.log("taskDeleteForLandlordMethod called with:", taskData);

    // Validate required fields
    if (!taskData.taskId || !taskData.landlordId) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError("Task ID and Landlord ID are required")
      );
    }

    try {
      // Delete the task from the task collection
      const deleteResult = await TaskCollection.removeAsync({ _id: taskData.taskId });
      
      if (deleteResult === 0) {
        throw new InvalidDataError("Task not found");
      }

      // Remove the task from the landlord's task_ids array using atomic $pull operation
      await LandlordCollection.updateAsync(
        { _id: taskData.landlordId },
        { $pull: { task_ids: taskData.taskId } }
      );

      return true;
    } catch (error) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(`Failed to delete task: ${error}`)
      );
    }
  },
};

/**
 * Deletes a task for TENANT from the database and removes it from the tenant's task list.
 */
const taskDeleteForTenantMethod = {
  [MeteorMethodIdentifier.TASK_DELETE_FOR_TENANT]: async (taskData: {
    taskId: string;
    tenantId: string;
  }): Promise<boolean> => {
    console.log("taskDeleteForTenantMethod called with:", taskData);

    // Validate required fields
    if (!taskData.taskId || !taskData.tenantId) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError("Task ID and Tenant ID are required")
      );
    }

    try {
      // Delete the task from the task collection
      const deleteResult = await TaskCollection.removeAsync({ _id: taskData.taskId });
      
      if (deleteResult === 0) {
        throw new InvalidDataError("Task not found");
      }

      // Remove the task from the tenant's task_ids array using atomic $pull operation
      await TenantCollection.updateAsync(
        { _id: taskData.tenantId },
        { $pull: { task_ids: taskData.taskId } }
      );

      return true;
    } catch (error) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(`Failed to delete task: ${error}`)
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
async function mapTaskDocumentToTaskDTO(task: TaskDocument): Promise<ApiTask> {
  return {
    taskId: task._id,
    name: task.name,
    status: task.taskStatus,
    createdDate: task.createdDate,
    dueDate: task.dueDate,
    description: task.description,
    priority: task.priority,
    propertyAddress: task.taskPropertyAddress,
    propertyId: task.taskPropertyId,
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
  ...taskInsertForLandlordMethod,
  ...taskInsertForTenantMethod,
  ...taskUpdateMethod,
  ...taskDeleteForAgentMethod,
  ...taskDeleteForLandlordMethod,
  ...taskDeleteForTenantMethod
});
