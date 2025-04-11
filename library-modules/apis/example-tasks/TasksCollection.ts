import { Mongo } from "meteor/mongo";
import { DbTask } from "./models/DbTask";

export const TasksCollection: Mongo.Collection<DbTask> = new Mongo.Collection("tasks");