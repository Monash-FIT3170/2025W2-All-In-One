import React from "react";
import { Task } from "./components/Task";
import { useTracker, useSubscribe } from "meteor/react-meteor-data";
import {
  addNewTask,
  getAllTasks,
} from "/library-modules/domain-models/task-example/repositories/task-repository";
import { MeteorPublicationIdentifier } from "/library-modules/apis/core-enums/meteor-publication-identifier";
import { AddTaskButton } from "./components/AddTaskButton";
import { HomePageUiState } from "./definitions/HomePageUiState";

// Acts as a VM; All business logic and validation should happen here. All data from APIs should be passed down from here
export function HomePage(): React.JSX.Element {
  const isLoading = useSubscribe(MeteorPublicationIdentifier.TASK);
  const tasks = useTracker(() => getAllTasks());
  
  const homePageUiState = {
    isLoading: isLoading(),
    taskDescriptions: tasks.map((task) => task.text),
    taskIds: tasks.map((task) => task.id),
  };

  function handleNewTaskAdded(text: string): void {
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
        <h1 className="title-example-style">Welcome to All in One!</h1>

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
