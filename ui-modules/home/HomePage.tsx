import React from "react";
import { Task } from "./components/Task";
import { useTracker, useSubscribe } from "meteor/react-meteor-data";
import { getAllTasks } from "/library-modules/apis/example-tasks/repositories/task-repository";
import { PublicationIdentifier } from "/library-modules/apis/core/publication-identifier";

export const HomePage = () => {
  const isLoading = useSubscribe(PublicationIdentifier.TASK);
  const tasks = useTracker(() => getAllTasks())

  if (isLoading()) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h1 className="font-bold">Welcome to Meteor!</h1>
        <ul>
          {tasks.map((task) => (
            <Task key={task.id} text={task.text} />
          ))}
        </ul>
      </div>
    );
  }
};
