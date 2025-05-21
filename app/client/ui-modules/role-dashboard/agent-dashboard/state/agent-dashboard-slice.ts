import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiAgent } from "/app/shared/api-models/user/api-roles/ApiAgent";
import { RootState } from "../../../../store";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

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

export const fetchAgentTasks = createAsyncThunk(
  "agentDashboard/fetchAgentTasks",
  async (userId: string) => {
    const response = await Meteor.callAsync(
      MeteorMethodIdentifier.AGENT_GET,
      userId
    );
    return response as ApiAgent;
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgentTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAgentTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure tasks are mapped to the correct shape if needed
        state.tasks = Array.isArray(action.payload.tasks)
          ? action.payload.tasks.map((task: any) =>
              typeof task === "string"
                ? { title: task, address: "", datetime: "", status: "Upcoming" }
                : task
            )
          : [];
      })
      .addCase(fetchAgentTasks.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setLoading, setProperties, setTasks, setError } =
  agentDashboardSlice.actions;

export const selectAgentDashboard = (state: RootState) => state.agentDashboard;
export const selectProperties = (state: RootState) =>
  state.agentDashboard.properties;
export const selectTasks = (state: RootState) => state.agentDashboard.tasks;
export const selectLoading = (state: RootState) =>
  state.agentDashboard.isLoading;

export default agentDashboardSlice.reducer;
