import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../../store";
import { getTenantById } from "/app/client/library-modules/domain-models/user/role-repositories/tenant-repository";
import { getTaskById } from "/app/client/library-modules/domain-models/task/repositories/task-repository";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { apiDeleteTaskForTenant, apiUpdateTask } from "/app/client/library-modules/apis/task/task-api";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { TaskPriority } from "/app/shared/task-priority-identifier";

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

export const deleteTenantCalendarTask = createAsyncThunk(
  "tenantCalendar/deleteTenantCalendarTask",
  async (args: { taskId: string; tenantId: string }, { getState }) => {
    try {
      const result = await apiDeleteTaskForTenant({
        taskId: args.taskId,
        tenantId: args.tenantId
      });
      
      if (result) {
        return args.taskId; // Return the deleted task ID for removal from state
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting tenant task:", error);
      throw error;
    }
  }
);

export const updateTenantCalendarTaskStatus = createAsyncThunk(
  "tenantCalendar/updateTenantCalendarTaskStatus",
  async (args: { taskId: string; status: TaskStatus }, { getState }) => {
    try {
      await apiUpdateTask({
        taskId: args.taskId,
        status: args.status
      });
      
      return { taskId: args.taskId, status: args.status }; // Return updated data for state update
    } catch (error) {
      console.error("Error updating tenant task status:", error);
      throw error;
    }
  }
);

export const updateTenantCalendarTask = createAsyncThunk(
  "tenantCalendar/updateTenantCalendarTask",
  async (args: { 
    taskId: string; 
    name?: string;
    description?: string;
    dueDate?: Date;
    priority?: TaskPriority;
  }) => {
    try {
      const result = await apiUpdateTask({
        taskId: args.taskId,
        name: args.name,
        description: args.description,
        dueDate: args.dueDate,
        priority: args.priority,
      });
      
      if (result) {
        // Fetch the updated task to return the complete data
        const updatedTask = await getTaskById(result);
        return updatedTask;
      } else {
        throw new Error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating tenant task:", error);
      throw error;
    }
  }
);

export const tenantCalendarSlice = createSlice({
  name: "tenantCalendar",
  initialState,
  reducers: {},
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
      })
      .addCase(deleteTenantCalendarTask.pending, (state) => {
        // Keep UI responsive during delete
      })
      .addCase(deleteTenantCalendarTask.fulfilled, (state, action) => {
        // Remove the deleted task from state
        state.tasks = state.tasks.filter(task => task.taskId !== action.payload);
      })
      .addCase(deleteTenantCalendarTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete task";
      })
      .addCase(updateTenantCalendarTaskStatus.pending, (state) => {
        // Keep UI responsive during update
      })
      .addCase(updateTenantCalendarTaskStatus.fulfilled, (state, action) => {
        // Update the task status in state
        const { taskId, status } = action.payload;
        const taskIndex = state.tasks.findIndex(task => task.taskId === taskId);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].status = status;
        }
      })
      .addCase(updateTenantCalendarTaskStatus.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update task status";
      })
      .addCase(updateTenantCalendarTask.pending, (state) => {
        // Keep UI responsive during update
      })
      .addCase(updateTenantCalendarTask.fulfilled, (state, action) => {
        // Update the task in state
        const taskIndex = state.tasks.findIndex(
          task => task.taskId === action.payload.taskId
        );
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = action.payload;
        }
      })
      .addCase(updateTenantCalendarTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update task";
      });
  },
});

// No manual actions exported - all state updates handled through async thunks

// Selectors
export const selectTenantCalendar = (state: RootState) => state.tenantCalendar;
export const selectTenantCalendarTasks = (state: RootState) => state.tenantCalendar.tasks;
export const selectTenantCalendarLoading = (state: RootState) => state.tenantCalendar.isLoading;
export const selectTenantCalendarError = (state: RootState) => state.tenantCalendar.error;

export default tenantCalendarSlice.reducer;
