import { MeteorMethodIdentifier } from "../core-enums/meteor-method-identifier";
import { DbTask } from "./models/DbTask";
import { TasksCollection } from "./task-collection";
import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

export function getAllDbTasks(): DbTask[] {
  return TasksCollection.find({}).fetch()
}

export function addNewTaskToDb(text: string): void {
  const newTask: Mongo.OptionalId<DbTask> = {
    text: text
  }
  
  Meteor.callAsync(MeteorMethodIdentifier.TASK_INSERT, newTask)
}