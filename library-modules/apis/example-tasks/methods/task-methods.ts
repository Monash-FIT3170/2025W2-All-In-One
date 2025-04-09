import { Meteor } from "meteor/meteor";
import { TasksCollection } from "../task-collection";
import { MeteorMethodIdentifier } from "../../core-enums/meteor-method-identifier";
import { Mongo } from "meteor/mongo";
import { DbTask } from "../models/DbTask";

const taskInsertMethod = {
  [MeteorMethodIdentifier.TASK_INSERT]: (doc: Mongo.OptionalId<DbTask>) => {
    return TasksCollection.insertAsync(doc);
  }
}

Meteor.methods({
  ...taskInsertMethod,
});
