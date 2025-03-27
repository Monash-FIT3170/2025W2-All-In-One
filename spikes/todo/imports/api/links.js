import { Mongo } from 'meteor/mongo';

export const db = new Mongo.Collection('task');
