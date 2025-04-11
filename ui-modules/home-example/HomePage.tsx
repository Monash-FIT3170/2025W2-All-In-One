import React, { useState } from "react";
import { Task } from "./components/Task";
import { useTracker, useSubscribe } from "meteor/react-meteor-data";
import {
  addNewTask,
  getAllTasks,
} from "/library-modules/domain-models/task-example/repositories/task-repository";
import { MeteorPublicationIdentifier } from "/library-modules/apis/core-enums/meteor-publication-identifier";
import { AddTaskButton } from "./components/AddTaskButton";
import { HomePageUiState } from "./definitions/HomePageUiState";

// Acts similar to a a VM; All business logic and validation should happen here. All data from APIs should be passed down from here
export function HomePage(): React.JSX.Element {
  const isLoading = useSubscribe(MeteorPublicationIdentifier.TASK);
  const tasks = useTracker(() => getAllTasks());
  const [exampleFlag, setExampleFlag] = useState(false)
  
  const homePageUiState = {
    isLoading: isLoading(),
    taskDescriptions: tasks.map((task) => task.text),
    taskIds: tasks.map((task) => task.id),
    exampleFlag: exampleFlag
  };

  // Some business logic for adding a new task
  function handleNewTaskAdded(text: string): void {
    // Validation logic can be added here. E.g. if something went wrong, 
    // set exampleFlag to true, which will cause a rerender and update homePageUiState
    setExampleFlag(true)
    addNewTask(text);
  }

  return (
    <HomePageBase
      homePageUiState={homePageUiState}
      onNewTaskAdded={handleNewTaskAdded}
    />
  );
}

function HomePageBase({
  homePageUiState,
  onNewTaskAdded,
}: {
  homePageUiState: HomePageUiState;
  onNewTaskAdded: (text: string) => void;
}): React.JSX.Element {
  if (homePageUiState.isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="p-5">

        {/* This should be a seperate react component */}
        <h1 className="title-example-style">Welcome to All in One!</h1>

        {/* This should be a seperate react component */}
        <ul className="list-example-style">
          {homePageUiState.taskDescriptions.map((description, i) => (
            <Task key={homePageUiState.taskIds[i]} text={description} />
          ))}
        </ul>

        <AddTaskButton
          onClick={() => {
            onNewTaskAdded("New Task");
          }}
        />
      </div>
    );
  }
}
