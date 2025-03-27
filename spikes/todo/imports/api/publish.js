import { Meteor } from "meteor/meteor";
import { db } from "./links";

Meteor.publish("task",() => {

    return db.find();
})