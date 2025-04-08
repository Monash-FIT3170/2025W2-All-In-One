import { Meteor } from "meteor/meteor";
import { TasksCollection } from "../../library-modules/apis/example-tasks/task-collections";
import "../../library-modules/apis/example-tasks/publications/task-publications"; 

const insertTask = (taskText: string) =>
  TasksCollection.insertAsync({ text: taskText });

Meteor.startup(async () => {
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
});