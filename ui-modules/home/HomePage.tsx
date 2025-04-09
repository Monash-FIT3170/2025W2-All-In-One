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
      <div className="p-5">
        <h1 className="font-bold italic">Welcome to All in One!</h1>

        <ul className="list-disc list-inside">
          {tasks.map((task) => (
            <Task key={task.id} text={task.text} />
          ))}
        </ul>

        {/* temp */}
        <AddTaskButton onClick={() => { addNewTask("hi") }} /> 

      </div>
    );
  }
};
