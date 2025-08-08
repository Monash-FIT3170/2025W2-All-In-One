import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { getPropertyByTenantId } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { getTenantById } from "/app/client/library-modules/domain-models/user/role-repositories/tenant-repository";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { getTaskById } from "/app/client/library-modules/domain-models/task/repositories/task-repository";

interface TenantDashboardState {
  isLoading: boolean;
  tasks: Task[];
  error: string | null;
  propertyDetails: ApiProperty | null;
  propertyLoading: boolean;
}

const initialState: TenantDashboardState = {
  isLoading: false,
  tasks: [],
  error: null,
  propertyDetails: null,
  propertyLoading: false,
};

export const fetchTenantTasks = createAsyncThunk(
  "tenantDashboard/fetchTenantTasks",
  async (userId: string) => {
    // First, get the tenant data which includes task IDs
    const tenantResponse = await getTenantById(userId);

    // Fetch task details for each task ID
    const taskDetails = [];
    if (tenantResponse.tasks && tenantResponse.tasks.length > 0) {
      for (const taskId of tenantResponse.tasks) {
        try {
          // Fetch task details using the TASK_GET method
          const taskData = await getTaskById(taskId);

          if (taskData) {
            // Format the task data for display
            taskDetails.push(taskData)
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

export const fetchTenantProperty = createAsyncThunk(
  "tenantDashboard/fetchTenantProperty",
  async (userId: string) => {
    try {
      // First, get the tenant data to get the tenant ID
      const tenantResponse = await Meteor.callAsync(
        MeteorMethodIdentifier.TENANT_GET,
        userId
      );

      if (!tenantResponse?.tenantId) {
        throw new Error("Tenant ID not found in response");
      }

      // Use the repository method instead of direct Meteor call
      const propertyData = await getPropertyByTenantId(tenantResponse.tenantId);

      if (!propertyData) {
        throw new Error("No property found for tenant");
      }

      return propertyData;
    } catch (error) {
      console.error("Error fetching tenant property:", error);
      throw error;
    }
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
      })
      .addCase(fetchTenantProperty.pending, (state) => {
        state.propertyLoading = true;
      })
      .addCase(fetchTenantProperty.fulfilled, (state, action) => {
        state.propertyLoading = false;
        state.propertyDetails = action.payload;
      })
      .addCase(fetchTenantProperty.rejected, (state, action) => {
        state.propertyLoading = false;
        state.error = action.error.message || "Failed to fetch property details";
      });
  },
});

export const { setLoading, setTasks, setError } = tenantDashboardSlice.actions;

export const selectTenantDashboard = (state: RootState) => state.tenantDashboard;
export const selectTasks = (state: RootState) => state.tenantDashboard.tasks;
export const selectLoading = (state: RootState) => state.tenantDashboard.isLoading;
export const selectPropertyDetails = (state: RootState) => state.tenantDashboard.propertyDetails;
export const selectPropertyLoading = (state: RootState) => state.tenantDashboard.propertyLoading;
export default tenantDashboardSlice.reducer;