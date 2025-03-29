import React from "react";
import { Task } from "./Task";
import { useTracker, useSubscribe } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/TasksCollection";
import { ApiTask } from "/imports/definitions/data";

export const App = () => {
  const isLoading = useSubscribe("tasks");
  const tasks: Array<ApiTask> = useTracker(() =>
    TasksCollection.find({}).fetch()
  ) as Array<ApiTask>;

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
