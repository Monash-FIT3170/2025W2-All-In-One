import { Mongo } from "meteor/mongo";
import { ApiTask } from "./models/api-task";

export const TasksCollection: Mongo.Collection<ApiTask> = new Mongo.Collection("tasks");