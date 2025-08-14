import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { getPropertyByTenantId } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { getTenantById } from "/app/client/library-modules/domain-models/user/role-repositories/tenant-repository";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { getTaskById } from "/app/client/library-modules/domain-models/task/repositories/task-repository";
import { Property } from "/app/client/library-modules/domain-models/property/Property";

export enum LeaseStatusKind {
  NotAvailable = "NOT_AVAILABLE",
  Active = "ACTIVE",
}

interface TenantDashboardState {
  isLoading: boolean;
  tasks: Task[];
  error: string | null;
  property: Property | null;
  messagesCount: number;
  leaseStatusKind: LeaseStatusKind;
  leaseMonthsRemaining: number | null;
}

const initialState: TenantDashboardState = {
  isLoading: false,
  tasks: [],
  error: null,
  property: null,
  messagesCount: 0, // Default value for messages
  leaseStatusKind: LeaseStatusKind.NotAvailable, // Default enum value
  leaseMonthsRemaining: null, // Default value for months
};

export const fetchTenantDetails = createAsyncThunk(
  "tenantDashboard/fetchTenantDetails",
  async (userId: string) => {
    // First, get the tenant data which includes task IDs
    let property = null;
    let tasks: Task[] = [];
    
    try {
      const tenantResponse = await getTenantById(userId);
      
      // Fetch tasks (if any)
      if (tenantResponse.tasks && tenantResponse.tasks.length > 0) {
        tasks = await Promise.all(
          tenantResponse.tasks.map((taskId) => {
            return getTaskById(taskId);
          })
        );
      }
      
      // Try to fetch property - this might fail if no property is assigned
      try {
        property = await getPropertyByTenantId(tenantResponse.tenantId);
      } catch (propertyError) {
        console.log("No property found for tenant:", tenantResponse.tenantId);
        // Property remains null - this is expected for tenants without assigned properties
      }
    }
    catch (error) {
      console.error("Error fetching tenant details:", error);
      throw new Error("Failed to fetch tenant details");
    }

    return {
      property: property,
      tasks: tasks,
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
    setMessagesCount: (state, action: PayloadAction<number>) => {
      state.messagesCount = action.payload;
    },
    setLeaseStatus: (state, action: PayloadAction<{ kind: LeaseStatusKind; monthsRemaining?: number }>) => {
      state.leaseStatusKind = action.payload.kind;
      state.leaseMonthsRemaining = action.payload.monthsRemaining ?? null;
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

export const { setLoading, setTasks, setError, setMessagesCount, setLeaseStatus } = tenantDashboardSlice.actions;

export const selectTenantDashboard = (state: RootState) => state.tenantDashboard;
export const selectTasks = (state: RootState) => state.tenantDashboard.tasks;
export const selectLoading = (state: RootState) => state.tenantDashboard.isLoading;
export const selectPropertyDetails = (state: RootState) => state.tenantDashboard.property;
export const selectMessagesCount = (state: RootState) => state.tenantDashboard.messagesCount;
export const selectLeaseStatusKind = (state: RootState) => state.tenantDashboard.leaseStatusKind;
export const selectLeaseMonthsRemaining = (state: RootState) => state.tenantDashboard.leaseMonthsRemaining;
export default tenantDashboardSlice.reducer;