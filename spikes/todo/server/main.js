import { Meteor } from 'meteor/meteor';
import { db } from '/imports/api/links';
import "../imports/api/publish"


const insertTask = (taskText) => db.insertAsync( {text: taskText});
Meteor.startup(async () => {
  // If the Links collection is empty, add some data.
  if (await db.find().countAsync() === 0) {
    [
    'One',
    'Two',
    'Three',
    'Four',
    'Five'
    ].forEach(insertTask);
  }
});
