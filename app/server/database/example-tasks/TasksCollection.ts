import { Mongo } from "meteor/mongo";
import { Task } from "./models/Task";

export const TasksCollection: Mongo.Collection<Task> = new Mongo.Collection("tasks");