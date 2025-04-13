import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomePageUiState } from "/ui-modules/home-example/state/HomePageUiState";
import {
  addNewTask as addNewTaskRepo,
  getAllTasks,
} from "/library-modules/domain-models/task-example/repositories/task-repository";
import { RootState } from "/app/store";

const initialState: HomePageUiState = {
  isLoading: true,
  taskDescriptions: [],
  taskIds: [],
  exampleTextboxValue: "",
};

export const homePageSlice = createSlice({
  name: "homePage",
  initialState: initialState,
  reducers: {
    updateTextboxValue: (state, action: PayloadAction<string>) => {
      state.exampleTextboxValue = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskDescriptions = action.payload.map((task) => task.text);
        state.taskIds = action.payload.map((task) => task.id);
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.taskDescriptions.push(action.payload.text);
        state.taskIds.push(action.payload.id);
      });
  },
});

export const loadTasks = createAsyncThunk("homePage/loadTasks", async () => {
  const tasks = await getAllTasks();
  return tasks;
});

export const addNewTask = createAsyncThunk(
  "homePage/addNewTask",
  async (text: string) => {
    const id = await addNewTaskRepo(text);
    const newTask = { id: id, text: text };
    return newTask;
  }
);

export const { updateTextboxValue } = homePageSlice.actions;
export const selectHomePageUiState = (state: RootState) => state.homePage