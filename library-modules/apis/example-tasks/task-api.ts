import { ApiTask } from "./models/api-task";
import { TasksCollection } from "./task-collection";
import { Meteor } from "meteor/meteor";

export function getAllApiTasks(): ApiTask[] {
  return TasksCollection.find({}).fetch()
}

export function addNewTaskToDb(text: string): void {
  const newTask = {
    text: text
  }
  
  Meteor.callAsync("tasks.insert", newTask)
}