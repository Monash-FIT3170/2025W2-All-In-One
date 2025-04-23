import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";

interface Property {
  address: string;
  status: "Closed" | "Maintenance" | "Draft" | "Listed";
  rent: number;
}

interface AgentDashboardState {
  isLoading: boolean;
  properties: Property[];
  tasks: Array<{
    title: string;
    address: string;
    datetime: string;
    status: "Upcoming" | "Due Soon" | "Overdue";
  }>;
  error: string | null;
}

const initialState: AgentDashboardState = {
  isLoading: false,
  properties: [],
  tasks: [],
  error: null,
};

export const agentDashboardSlice = createSlice({
  name: "agentDashboard",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
    },
    setTasks: (state, action: PayloadAction<AgentDashboardState["tasks"]>) => {
      state.tasks = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setProperties, setTasks, setError } = agentDashboardSlice.actions;

export const selectAgentDashboard = (state: RootState) => state.agentDashboard;
export const selectProperties = (state: RootState) => state.agentDashboard.properties;
export const selectTasks = (state: RootState) => state.agentDashboard.tasks;

export default agentDashboardSlice.reducer;