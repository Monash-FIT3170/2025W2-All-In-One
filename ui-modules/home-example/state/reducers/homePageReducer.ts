import { Task } from "/library-modules/domain-models/task-example/Task";
import { HomePageUiState } from "/ui-modules/home-example/state/HomePageUiState";

export function homePageReducer(
  state: HomePageUiState,
  action: HomePageAction
): HomePageUiState {
  switch (action.type) {
    case HomePageActionType.ADD_NEW_TASK:
      return {
        ...state,
        taskDescriptions: [...state.taskDescriptions, action.payload.text],
        taskIds: [...state.taskIds, action.payload.id],
      };

    case HomePageActionType.LOAD_TASKS:
      return {
        ...state,
        taskDescriptions: action.payload.map((task) => task.text),
        taskIds: action.payload.map((task) => task.id),
        isLoading: false,
      };

    case HomePageActionType.SET_TEXTBOX_VALUE:
      return { ...state, exampleTextboxValue: action.payload };
  }
}

export enum HomePageActionType {
  LOAD_TASKS,
  ADD_NEW_TASK,
  SET_TEXTBOX_VALUE,
}

type AddNewTask = {
  type: HomePageActionType.ADD_NEW_TASK;
  payload: {
    id: string;
    text: string;
  };
};

type LoadTasks = {
  type: HomePageActionType.LOAD_TASKS;
  payload: Task[];
};

type SetTextboxValue = {
  type: HomePageActionType.SET_TEXTBOX_VALUE;
  payload: string;
};

export type HomePageAction = AddNewTask | LoadTasks | SetTextboxValue;
