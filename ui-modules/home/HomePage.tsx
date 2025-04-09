import React from "react";
import { Task } from "./components/Task";
import { useTracker, useSubscribe } from "meteor/react-meteor-data";
import { addNewTask, getAllTasks } from "/library-modules/apis/example-tasks/repositories/task-repository";
import { PublicationIdentifier } from "/library-modules/apis/core/publication-identifier";
import { AddTaskButton } from "./components/AddTaskButton";

export const HomePage = () => {
  const isLoading = useSubscribe(PublicationIdentifier.TASK);
  const tasks = useTracker(() => getAllTasks())

  if (isLoading()) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h1 className="font-bold italic">Welcome to Meteor!</h1>
        <ul>
          {tasks.map((task) => (
            <Task key={task.id} text={task.text} />
          ))}
        </ul>
        <AddTaskButton onClick={() => { addNewTask("hi") }} />
      </div>
    );
  }
};
