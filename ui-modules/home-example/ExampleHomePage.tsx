import React, { useEffect, useReducer } from "react";
import { Task } from "./components/Task";
import {
  addNewTask,
  getAllTasks,
} from "/library-modules/domain-models/task-example/repositories/task-repository";
import { AddTaskButton } from "./components/AddTaskButton";
import { HomePageUiState } from "./state/HomePageUiState";
import { HomePageActionType, homePageReducer } from "./state/reducers/homePageReducer";

const initialHomePageUiState: HomePageUiState = {
  isLoading: true,
  taskDescriptions: [],
  taskIds: [],
  exampleTextboxValue: "",
};

// VM equivalent. VMs should be at section or page level if the entire page is similar to one section (such as for this example).
export function ExampleHomePage(): React.JSX.Element {
  const [homePageUiState, dispatch] = useReducer(homePageReducer, initialHomePageUiState)

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const tasks = await getAllTasks();
    dispatch({
      type: HomePageActionType.LOAD_TASKS,
      payload: tasks,
    });
  }

  async function handleNewTaskAdded(text: string): Promise<void> {
    const newTaskId = await addNewTask(text);
    dispatch({
      type: HomePageActionType.ADD_NEW_TASK,
      payload: {id: newTaskId, text: text},
    });
  }

  function handleTextboxChange(newValue: string): void {
    dispatch({
      type: HomePageActionType.SET_TEXTBOX_VALUE,
      payload: newValue,
    });
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
