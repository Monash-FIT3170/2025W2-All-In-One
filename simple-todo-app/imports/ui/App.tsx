import React from "react";
import { Task } from "./Task";
import { useTracker, useSubscribe } from "meteor/react-meteor-data";
import { TasksCollection } from "../api/TasksCollection";

// Would usually be centralised in a data model definition
type Task = {
  _id: number;
  text: string;
};

export const App = () => {
  const isLoading = useSubscribe("tasks");
  const tasks: Array<Task> = useTracker(() => TasksCollection.find({}).fetch());

  if (isLoading()) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h1>Welcome to Meteor!</h1>
        <ul>
          {tasks.map((task) => (
            <Task key={task._id} task={task} />
          ))}
        </ul>
      </div>
    );
  }
};
