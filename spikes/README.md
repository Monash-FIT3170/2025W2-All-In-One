# Technology Tutorial Plan
This tutorial will follow the [Meteorjs 3 + React tutorial] (https://docs.meteor.com/tutorials/react/) Steps 1,2 and 8 with added features specific to All in One
## Table of Contents
- [Set Up](#set-up)

---
### Set up
We first need to install meteor, if you don't have meteor installed use:
``` 
npx meteor
``` 
if `npx meteor` gives an error run
```
npx clear-npx-cache
npm install -g meteor --foreground-script
```
Go into your preferred directory and create your meteor app using
```
meteor create todo
```
All the necessary files will be made for you and will be explained to you later, but first lets run your app.
```
meteor run
```
access your app using http://localhost:3000/.
You can keep this server up and meteor will sync up any changes you make.

---
### To-do App
We will be making a small to-do app with a local mongodb to store our tasks

Lets first create our Task Component in React.
go to `/imports/ui` and create a new jsx file `Task.jsx`, this will represent a task in our todo list
```
import React from "react";

export const Task = ({ task }) => {
  return <li>{task.text}</li>;
};
```

Next we will create our database for our app. Go to `/imports/api/links`, lets replace the content inside with 
```
import { Mongo } from 'meteor/mongo';

export const db = new Mongo.Collection('task');
```
This creates a `collection` and exports it.

---
For our collection to work, we need to import it to our server.
In `server/main.js` we can add the following:
```
import { db } from '/imports/api/links';
```
Since we are reusing the links file you can probably keep what you have, just make sure the database is imported

For now we will insert some data on startup of our todo list.
```
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
```
This creates a function to insert a task and instantiates our database with some tasks.

---
We will need to render our tasks using a React Function Component and a hook called `useTracker`.
To add `userTracker` run:
```
meteor add react-meteor-data
```

`useTracker` is a React Hook function exported by `react-meteor-data` that allows you to have reactivity in your components. It automatically re-hydrates our components when the data is updated!
In `imports/ui/App.jsx`
```
import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { db } from "/imports/api/links";
import { Task } from "./Task";

export const App = () => {
  const tasks = useTracker(() => db.find({}).fetch());

  return (
    <div>
      <h1>Welcome to Meteor!</h1>

      <h2>Learn Meteor! </h2>
      <ul>
        {tasks.map((task) => (
          <Task key={task._id} task={task} />
        ))}
      </ul>
    </div>
  );
};
``` 
We aren't finished! Even with this our tasks aren't loading, thats because the tasks are not visible for the client to ingest yet.

Create an API to publish the data to our client
`imports/api/publish.js` .
```
import { Meteor } from "meteor/meteor";
import { db } from "./links";

Meteor.publish("tasks", () => {
  return db.find();
});
```
We need to import this to our server.
`server/main.js`
```
import "../imports/api/publish"; 
```

The only thing to do is to subscribe to this publication
`imports/ui/App.jsx`
```
import React from 'react';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data'; 
import { db } from '/imports/api/db';
import { Task } from './Task';

export const App = () => {

  const isLoading = useSubscribe("tasks");  
  const tasks = useTracker(() => db.find({}).fetch());

  if (isLoading()) {
    return <div>Loading...</div>;
  }
  ...
}
```

---
### Deployment