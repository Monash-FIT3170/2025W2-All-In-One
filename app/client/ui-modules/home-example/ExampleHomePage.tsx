import React, { useEffect } from "react";
import { Task } from "./components/Task";
import { AddTaskButton } from "./components/AddTaskButton";
import { HomePageUiState } from "./state/HomePageUiState";
import { addNewTask, loadTasks, selectHomePageUiState, updateTextboxValue } from "./state/reducers/home-page-slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";

export function ExampleHomePage(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const homePageUiState: HomePageUiState = useSelector(selectHomePageUiState)

  useEffect(() => {
    dispatch(loadTasks());
  }, []);

  function handleNewTaskAdded(text: string): void {
    dispatch(addNewTask(text));
  }

  function handleTextboxChange(newValue: string): void {
    dispatch(updateTextboxValue(newValue));
  }

  return (
    <ExampleHomePageBase
      homePageUiState={homePageUiState}
      onNewTaskAdded={handleNewTaskAdded}
      onTextboxChange={handleTextboxChange}
    />
    // Some other components here too that would also receive homePageUiState
  );
}

function ExampleHomePageBase({
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
        <h1 className="font-bold italic">Welcome to All in One!</h1>

        {/* This should be a seperate react component */}
        <ul className="list-disc list-inside">
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
          className="shadow block"
          placeholder="Type something..."
          value={homePageUiState.exampleTextboxValue}
          onChange={(e) => onTextboxChange(e.target.value)}
        />
      </div>
    );
  }
}