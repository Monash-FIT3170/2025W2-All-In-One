import { Meteor } from "meteor/meteor";
import { TasksCollection } from "../TasksCollection";
import { MeteorMethodIdentifier } from "/library-modules/apis/core-enums/meteor-method-identifier";
import { Mongo } from "meteor/mongo";
import { DbTask } from "../models/DbTask";

const taskInsertMethod = {
  [MeteorMethodIdentifier.TASK_INSERT]: (doc: Mongo.OptionalId<DbTask>) => {
    return TasksCollection.insertAsync(doc);
  }
}

const taskGetAllMethod = {
  [MeteorMethodIdentifier.TASK_GET_ALL]: () => {
    return TasksCollection.find({}).fetch();
  }
}

Meteor.methods({
  ...taskInsertMethod,
  ...taskGetAllMethod
});
