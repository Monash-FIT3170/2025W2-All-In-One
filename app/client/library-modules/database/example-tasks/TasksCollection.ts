import { Mongo } from "meteor/mongo";
import { TaskDocument } from "./models/TaskDocument";

export const TasksCollection: Mongo.Collection<TaskDocument> = new Mongo.Collection("tasks");