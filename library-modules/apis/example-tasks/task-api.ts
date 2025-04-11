import { MeteorMethodIdentifier } from "../core-enums/meteor-method-identifier";
import { DbTask } from "./models/DbTask";
import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

export async function getAllDbTasks(): Promise<DbTask[]> {
  return Meteor.callAsync(MeteorMethodIdentifier.TASK_GET_ALL);
}

export async function addNewTaskToDb(text: string): Promise<string> {
  const newTask: Mongo.OptionalId<DbTask> = {
    text: text
  }
  
  return Meteor.callAsync(MeteorMethodIdentifier.TASK_INSERT, newTask)
}