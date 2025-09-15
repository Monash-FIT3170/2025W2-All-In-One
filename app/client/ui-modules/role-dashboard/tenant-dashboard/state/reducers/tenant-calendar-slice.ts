import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../../store";
import { getTenantById } from "/app/client/library-modules/domain-models/user/role-repositories/tenant-repository";
import { getTaskById } from "/app/client/library-modules/domain-models/task/repositories/task-repository";
import { Task } from "/app/client/library-modules/domain-models/task/Task";

interface TenantCalendarState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TenantCalendarState = {
  tasks: [],
  isLoading: false,
  error: null,
};

export const fetchTenantCalendarTasks = createAsyncThunk(
  "tenantCalendar/fetchTenantCalendarTasks",
  async (userId: string) => {
    try {
      const tenantResponse = await getTenantById(userId);
      console.log("fetching tenant calendar tasks");

      // Fetch tasks (if any)
      let tasks: Task[] = [];
      if (tenantResponse.tasks && tenantResponse.tasks.length > 0) {
        const taskDetailsResults = await Promise.all(
          tenantResponse.tasks.map(async (taskId) => {
            try {
              return await getTaskById(taskId);
            } catch (error) {
              console.error(`Error fetching task ${taskId}:`, error);
              return null; // skip failed tasks
            }
          })
        );

        // Filter out any null results
        tasks = taskDetailsResults.filter(
          (task): task is Task => task !== null
        );
      }

      return tasks;
    } catch (error) {
      console.error("Error fetching tenant calendar tasks:", error);
      throw new Error("Failed to fetch tenant calendar tasks");
    }
  }
);

export const tenantCalendarSlice = createSlice({
  name: "tenantCalendar",
  initialState,
  reducers: {
    setCalendarLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCalendarTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setCalendarError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCalendarError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenantCalendarTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTenantCalendarTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload || [];
      })
      .addCase(fetchTenantCalendarTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch tenant calendar tasks";
      });
  },
});

export const { 
  setCalendarLoading, 
  setCalendarTasks, 
  setCalendarError, 
  clearCalendarError 
} = tenantCalendarSlice.actions;

// Selectors
export const selectTenantCalendar = (state: RootState) => state.tenantCalendar;
export const selectTenantCalendarTasks = (state: RootState) => state.tenantCalendar.tasks;
export const selectTenantCalendarLoading = (state: RootState) => state.tenantCalendar.isLoading;
export const selectTenantCalendarError = (state: RootState) => state.tenantCalendar.error;

export default tenantCalendarSlice.reducer;
