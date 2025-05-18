import { Mongo } from "meteor/mongo";
import { TaskDocument } from "./models/TaskDocument";
import { TaskStatusDocument } from "./models/TaskStatusDocument";

export const TaskCollection: Mongo.Collection<TaskDocument> =
  new Mongo.Collection("tasks");
export const TaskStatusCollection: Mongo.Collection<TaskStatusDocument> =
  new Mongo.Collection("task_statuses");
  