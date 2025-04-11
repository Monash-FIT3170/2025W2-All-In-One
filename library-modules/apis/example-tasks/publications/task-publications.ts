import { Meteor } from 'meteor/meteor';
import { TasksCollection } from "../TasksCollection";
import { MeteorPublicationIdentifier } from "../../core-enums/meteor-publication-identifier";

Meteor.publish(
  MeteorPublicationIdentifier.TASK, () => { return TasksCollection.find() }
);