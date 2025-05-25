import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";


interface TenantDashboardState {
  isLoading: boolean;
  tasks: Array<{
    title: string;
    address?: string;
    datetime: string;
    status: string;
    description?: string;
    priority?: string;
    taskId?: string;
  }>;
  error: string | null;
}

const initialState: TenantDashboardState = {
  isLoading: false,
  tasks: [],
  error: null,
};

export const fetchTenantTasks = createAsyncThunk(
  "tenantDashboard/fetchTenantTasks",
  async (userId: string) => {
    // First, get the tenant data which includes task IDs
    const tenantResponse = await Meteor.callAsync(
      MeteorMethodIdentifier.TENANT_GET,
      userId
    );

    // Fetch task details for each task ID
    const taskDetails = [];
    if (tenantResponse.tasks && tenantResponse.tasks.length > 0) {
      for (const taskId of tenantResponse.tasks) {
        try {
          // Fetch task details using the TASK_GET method
          const taskData = await Meteor.callAsync(
            MeteorMethodIdentifier.TASK_GET,
            taskId
          );

          if (taskData) {
            // Format the task data for display
            taskDetails.push({
              title: taskData.name,
              description: taskData.description,
              datetime: taskData.dueDate ? new Date(taskData.dueDate).toLocaleDateString() : '',
              status: taskData.status,
              priority: taskData.priority,
              taskId: taskData.taskId
            });
          }
        } catch (error) {
          console.error(`Error fetching task ${taskId}:`, error);
        }
      }
    }

    return {
      ...tenantResponse,
      taskDetails: taskDetails,
    };
  }
);

export const tenantDashboardSlice = createSlice({
  name: "tenantDashboard",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTasks: (state, action: PayloadAction<TenantDashboardState["tasks"]>) => {
      state.tasks = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenantTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTenantTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        // Use the fetched task details
        state.tasks = action.payload.taskDetails || [];
      })
      .addCase(fetchTenantTasks.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setLoading, setTasks, setError } = tenantDashboardSlice.actions;

export const selectTenantDashboard = (state: RootState) => state.tenantDashboard;
// export const selectProperties = (state: RootState) => state.agentDashboard.properties;
export const selectTasks = (state: RootState) => state.tenantDashboard.tasks;

export default tenantDashboardSlice.reducer;