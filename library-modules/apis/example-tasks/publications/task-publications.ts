import { Meteor } from 'meteor/meteor';
import { TasksCollection } from "../task-collection";
import { PublicationIdentifier } from "/library-modules/apis/core/publication-identifier";

Meteor.publish(PublicationIdentifier.TASK, () => {
  return TasksCollection.find();
});