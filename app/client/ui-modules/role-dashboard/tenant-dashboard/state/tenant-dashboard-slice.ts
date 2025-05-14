import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";


interface TenantDashboardState {
  isLoading: boolean;
//   properties: Property[];
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
//   properties: [],
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
    // setProperties: (state, action: PayloadAction<Property[]>) => {
    //   state.properties = action.payload;
    // },
    setTasks: (state, action: PayloadAction<TenantDashboardState["tasks"]>) => {
      state.tasks = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setTasks, setError } = tenantDashboardSlice.actions;

export const selectTenantDashboard = (state: RootState) => state.tenantDashboard;
// export const selectProperties = (state: RootState) => state.agentDashboard.properties;
export const selectTasks = (state: RootState) => state.tenantDashboard.tasks;

export default tenantDashboardSlice.reducer;