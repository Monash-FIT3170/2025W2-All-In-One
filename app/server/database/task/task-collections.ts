import { Mongo } from "meteor/mongo";
import { TaskDocument } from "./models/TaskDocument";

export const TaskCollection: Mongo.Collection<TaskDocument> =
  new Mongo.Collection("tasks");