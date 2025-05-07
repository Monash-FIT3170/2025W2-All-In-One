import { Meteor } from "meteor/meteor";
import { TasksCollection } from "./database/example-tasks/TasksCollection";
import "./methods/example-tasks/task-methods";
import "./methods/azure/blob_methods";
import "./settings-to-env";
Meteor.startup(tempSeedFunction);

// TODO: This code and below is temporary and will be removed in the future.
async function tempSeedFunction(): Promise<void> {
  if ((await TasksCollection.find().countAsync()) === 0) {
    [
      "First Task",
      "Second Task",
      "Third Task",
      "Fourth Task",
      "Fifth Task",
      "Sixth Task",
      "Seventh Task",
    ].forEach(insertTask);
  }
}

const insertTask = (taskText: string) =>
  TasksCollection.insertAsync({ text: taskText });