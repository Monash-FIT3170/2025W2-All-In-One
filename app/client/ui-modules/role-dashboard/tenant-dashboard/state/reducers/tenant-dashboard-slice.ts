import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../../store";
import { getPropertyByTenantId } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { getTenantById } from "/app/client/library-modules/domain-models/user/role-repositories/tenant-repository";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { getTaskById } from "/app/client/library-modules/domain-models/task/repositories/task-repository";
import { Property } from "/app/client/library-modules/domain-models/property/Property";

interface TenantDashboardState {
  isLoading: boolean;
  tasks: Task[];
  error: string | null;
  property: Property | null;
}

const initialState: TenantDashboardState = {
  isLoading: false,
  tasks: [],
  error: null,
  property: null,
};

export const fetchTenantDetails = createAsyncThunk(
  "tenantDashboard/fetchTenantTasks",
  async (userId: string) => {
    // First, get the tenant data which includes task IDs
    let property;
    let tasks;
    try {
      const tenantResponse = await getTenantById(userId);
      tasks = await Promise.all(
         tenantResponse.tasks.map((taskId) => {
         return getTaskById(taskId);
        }
      )
    )
    property = await getPropertyByTenantId(tenantResponse.tenantId);  
    }
    catch (error) {
      console.error("Error fetching tenant details:", error);
      throw new Meteor.Error("Failed to fetch tenant details");
    }

    return {
      property: property,
      tasks: tasks,
    };
  }
);

export const fetchTenantTasks = createAsyncThunk(
  "tenantDashboard/fetchTenantProperty",
  async (userId: string) => {
    let tasks;
    try {
      const tenantResponse = await getTenantById(userId);
      tasks = await Promise.all(
         tenantResponse.tasks.map((taskId) => {
         return getTaskById(taskId);
        }
      )
    )
  }
  catch (error) {
    console.error("Error fetching tenant tasks:", error);
    throw new Meteor.Error("Failed to fetch tenant tasks");
  }
  return { tasks: tasks };
})

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
      .addCase(fetchTenantDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTenantDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        // Use the fetched task details
        state.tasks = action.payload.tasks || [];
        state.property = action.payload.property || null; 

      })
      .addCase(fetchTenantDetails.rejected, (state) => {
        state.isLoading = false;
      })
  },
});

export const { setLoading, setTasks, setError } = tenantDashboardSlice.actions;

export const selectTenantDashboard = (state: RootState) => state.tenantDashboard;
export const selectTasks = (state: RootState) => state.tenantDashboard.tasks;
export const selectLoading = (state: RootState) => state.tenantDashboard.isLoading;
export const selectPropertyDetails = (state: RootState) => state.tenantDashboard.property;
export default tenantDashboardSlice.reducer;