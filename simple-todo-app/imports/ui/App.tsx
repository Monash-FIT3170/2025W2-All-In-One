import React from "react";
import { Task } from "./Task.tsx";
import { useTracker, useSubscribe } from "meteor/react-meteor-data";
import { TasksCollection } from "../api/TasksCollection.ts";

type Task = {
  _id: number;
  text: string;
};

const tasks: Array<Task> = [
  { _id: 1, text: "First Task" },
  { _id: 2, text: "Second Task" },
  { _id: 3, text: "Third Task" },
];

export const App = () => {
  const isLoading = useSubscribe("tasks");
  const tasks = useTracker(() => TasksCollection.find({}).fetch());

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
