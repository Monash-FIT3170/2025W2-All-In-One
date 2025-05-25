import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
    address?: string;
    datetime: string;
    status: string;
    description?: string;
    priority?: string;
    taskId?: string;
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
    // First, get the agent data which includes task IDs
    const agentResponse = await Meteor.callAsync(
      MeteorMethodIdentifier.AGENT_GET,
      userId
    );
    
    // Fetch task details for each task ID
    const taskDetails = [];
    if (agentResponse.tasks && agentResponse.tasks.length > 0) {
      for (const taskId of agentResponse.tasks) {
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
      ...agentResponse,
      taskDetails: taskDetails,
    };
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
        // Use the fetched task details
        state.tasks = action.payload.taskDetails || [];
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
