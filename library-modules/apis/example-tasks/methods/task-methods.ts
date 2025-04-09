import { Meteor } from "meteor/meteor";
import { TasksCollection } from "../task-collection";

Meteor.methods({
  "tasks.insert"(doc) {
    return TasksCollection.insertAsync(doc);
  },
});