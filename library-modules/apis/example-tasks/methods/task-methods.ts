import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { TasksCollection } from "/library-modules/database/example-tasks/TasksCollection";
import { TaskDocument } from "/library-modules/database/example-tasks/models/TaskDocument";
import { MeteorMethodIdentifier } from "/library-modules/apis/core-enums/meteor-method-identifier";

const taskInsertMethod = {
  [MeteorMethodIdentifier.TASK_INSERT]: (doc: Mongo.OptionalId<TaskDocument>): Promise<string> => {
    return TasksCollection.insertAsync(doc);
  }
}

const taskGetAllMethod = {
  [MeteorMethodIdentifier.TASK_GET_ALL]: (): TaskDocument[] => {
    return TasksCollection.find({}).fetch();
  }
}

Meteor.methods({
  ...taskInsertMethod,
  ...taskGetAllMethod
});
