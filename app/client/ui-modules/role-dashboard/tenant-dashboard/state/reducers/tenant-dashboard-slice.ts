import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../../store";
import { getPropertyByTenantId } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { getTenantById } from "/app/client/library-modules/domain-models/user/role-repositories/tenant-repository";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { getTaskById } from "/app/client/library-modules/domain-models/task/repositories/task-repository";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { getLeaseAgreementsForProperty } from "/app/client/library-modules/domain-models/user-documents/repositories/lease-agreement-repository";
import { LeaseAgreementDocument } from "/app/client/library-modules/domain-models/user-documents/LeaseAgreement";
import { differenceInMonths, isAfter } from "date-fns";

export enum LeaseStatusKind {
  NotAvailable = "NOT_AVAILABLE",
  Active = "ACTIVE",
}

interface TenantDashboardState {
  isLoading: boolean;
  tasks: Task[];
  error: string | null;
  property: Property | null;
  leaseAgreements: LeaseAgreementDocument[];
  messagesCount: number;
  leaseStatusKind: LeaseStatusKind;
  leaseMonthsRemaining: number | null;
}

const initialState: TenantDashboardState = {
  isLoading: false,
  tasks: [],
  error: null,
  property: null,
  leaseAgreements: [],
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
    let leaseAgreements: LeaseAgreementDocument[] = [];
    let leaseStatusKind = LeaseStatusKind.NotAvailable;
    let leaseMonthsRemaining: number | null = null;
    
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
        
        // If property exists, fetch lease agreements
        if (property) {
          try {
            leaseAgreements = await getLeaseAgreementsForProperty(property.propertyId);
            
            // Find the most recent active lease agreement
            const now = new Date();
            const activeLease = leaseAgreements
              .filter(lease => isAfter(lease.validUntil, now))
              .sort((a, b) => b.validUntil.getTime() - a.validUntil.getTime())[0];
            
            if (activeLease) {
              leaseStatusKind = LeaseStatusKind.Active;
              leaseMonthsRemaining = Math.max(0, differenceInMonths(activeLease.validUntil, now));
            } else {
              // If there are lease agreements but none are active, or no lease agreements at all
              leaseStatusKind = LeaseStatusKind.NotAvailable;
            }
          } catch {
            console.log("No lease agreements found for property:", property.propertyId);
          }
        } else {
          leaseStatusKind = LeaseStatusKind.NotAvailable;
        }
      } catch {
        console.log("No property found for tenant:", tenantResponse.tenantId);
        leaseStatusKind = LeaseStatusKind.NotAvailable;
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
      leaseAgreements: leaseAgreements,
      leaseStatusKind: leaseStatusKind,
      leaseMonthsRemaining: leaseMonthsRemaining,
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
        state.leaseAgreements = action.payload.leaseAgreements || [];
        state.leaseStatusKind = action.payload.leaseStatusKind;
        state.leaseMonthsRemaining = action.payload.leaseMonthsRemaining;
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
export const selectLeaseAgreements = (state: RootState) => state.tenantDashboard.leaseAgreements;
export const selectMessagesCount = (state: RootState) => state.tenantDashboard.messagesCount;
export const selectLeaseStatusKind = (state: RootState) => state.tenantDashboard.leaseStatusKind;
export const selectLeaseMonthsRemaining = (state: RootState) => state.tenantDashboard.leaseMonthsRemaining;
export default tenantDashboardSlice.reducer;