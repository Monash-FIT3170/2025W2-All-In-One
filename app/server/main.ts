import { Meteor } from "meteor/meteor";
import { TasksCollection } from "/library-modules/apis/example-tasks/task-collection";
import "/library-modules/apis/example-tasks/publications/task-publications";

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
