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

// VM equivalent. VMs should be at section or page level if the entire page is similar to one section (such as for this example).
export function HomePage(): React.JSX.Element {
  const isLoading = useSubscribe(MeteorPublicationIdentifier.TASK);
  const tasks = useTracker(() => getAllTasks());

  const [exampleFlag, setExampleFlag] = useState(false);
  const [exampleTextboxValue, setExampleTextboxValue] = useState("");

  const homePageUiState = {
    isLoading: isLoading(),
    taskDescriptions: tasks.map((task) => task.text),
    taskIds: tasks.map((task) => task.id),
    exampleFlag: exampleFlag,
    exampleTextboxValue: exampleTextboxValue,
  };

  function handleNewTaskAdded(text: string): void {
    if (true) {
      setExampleFlag(true); // Example of setting a flag based on some condition or validation
    }
    addNewTask(text);
  }

  function handleTextboxChange(newValue: string): void {
    setExampleTextboxValue(newValue);
  }

  return (
    <HomePageBase
      homePageUiState={homePageUiState}
      onNewTaskAdded={handleNewTaskAdded}
      onTextboxChange={handleTextboxChange}
    />
    // Some other components here too that would also receive homePageUiState
  );
}

function HomePageBase({
  homePageUiState,
  onNewTaskAdded,
  onTextboxChange,
}: {
  homePageUiState: HomePageUiState;
  onNewTaskAdded: (text: string) => void;
  onTextboxChange: (text: string) => void;
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

        {/* This should be a seperate react component */}
        <input
          type="text"
          className="textbox-example-style"
          placeholder="Type something..."
          value={homePageUiState.exampleTextboxValue}
          onChange={(e) => onTextboxChange(e.target.value)}
        />
      </div>
    );
  }
}
