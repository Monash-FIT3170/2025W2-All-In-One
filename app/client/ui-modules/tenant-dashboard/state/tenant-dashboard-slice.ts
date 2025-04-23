import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";

interface TenantDashboardState {
  isLoading: boolean;
  propertyDetails: {
    propertyManager: {
      name: string;
      email: string;
      initials: string;
    };
    leaseTerm: {
      startDate: string;
      endDate: string;
      monthsLeft: number;
    };
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    rent: {
      amount: number;
      dueDate: string;
    };
  } | null;
  tasks: Array<{
    title: string;
    address: string;
    datetime: string;
    status: "Upcoming" | "Due Soon" | "Overdue";
  }>;
  error: string | null;
}

const initialState: TenantDashboardState = {
  isLoading: false,
  propertyDetails: null,
  tasks: [],
  error: null,
};

export const tenantDashboardSlice = createSlice({
  name: "tenantDashboard",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPropertyDetails: (state, action: PayloadAction<TenantDashboardState["propertyDetails"]>) => {
      state.propertyDetails = action.payload;
    },
    setTasks: (state, action: PayloadAction<TenantDashboardState["tasks"]>) => {
      state.tasks = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setPropertyDetails, setTasks, setError } = tenantDashboardSlice.actions;

export const selectTenantDashboard = (state: RootState) => state.tenantDashboard;
export const selectPropertyDetails = (state: RootState) => state.tenantDashboard.propertyDetails;
export const selectTasks = (state: RootState) => state.tenantDashboard.tasks;

export default tenantDashboardSlice.reducer;