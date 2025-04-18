import React, { useEffect } from "react";
import { Task } from "./components/Task";
import { AddTaskButton } from "./components/AddTaskButton";
import { HomePageUiState } from "./state/HomePageUiState";
import PrimaryButton from "../theming/PrimaryButton";
import { Link } from "react-router";
import Ripple from "./Ripple";
import {
  addNewTask,
  loadTasks,
  selectHomePageUiState,
  updateTextboxValue,
} from "./state/reducers/home-page-slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "/app/store";
import { SideNavBar } from "../../ui-modules/shared/navigation-bars/SideNavbar";
import { TopNavbar } from "../../ui-modules/shared/navigation-bars/Navbar";

export function ExampleHomePage(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const homePageUiState: HomePageUiState = useSelector(selectHomePageUiState);

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
  const [isSidebarOpen, onSideBarOpened] = React.useState(false);
  if (homePageUiState.isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="p-5">
        {/* TopNavbar: Pass `setSidebarOpen` prop to control sidebar state */}
        <TopNavbar onSideBarOpened={onSideBarOpened} />

        {/* Sidebar & Backdrop */}
        <SideNavBar
          isOpen={isSidebarOpen}
          onClose={() => onSideBarOpened(false)}
        />
        <div className="relative flex flex-col items-center justify-center min-h-[80vh] bg-white overflow-hidden px-4">
          {/* Animated Ripple Background */}
          <Ripple />
          {/* Foreground content */}
          <div className="relative z-10 text-center">
            <h1
              className="text-5xl md:text-6xl font-extrabold mb-6"
              style={{ color: "var(--black)" }}
            >
              Find your perfect rental home
            </h1>
            <p className="text-lg mb-6" style={{ color: "var(--dark-grey)" }}>
              Search thousands of rental properties in your area
            </p>
            {/* Search input and button */}
            <div className="flex justify-center gap-4">
              <input
                type="text"
                placeholder="Enter city or postcode"
                className="p-2 border border-[color:var(--medium-grey)] rounded-lg w-64 text-black placeholder-[color:var(--medium-grey)]"
              />

              <Link to="/signup">
                <PrimaryButton variant="black">Search</PrimaryButton>
              </Link>
            </div>
          </div>
        </div>

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
