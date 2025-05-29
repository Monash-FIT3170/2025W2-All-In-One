import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";

type Property = ApiProperty;

interface AgentDashboardState {
  isLoading: boolean;
  properties: Property[];
  propertyCount: number;
  monthlyRevenue: number;
  occupancyRate: number;
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
  propertyCount: 0,
  monthlyRevenue: 0,
  occupancyRate: 0,
  tasks: [],
  error: null,
};

// Async thunks
export const fetchPropertyCount = createAsyncThunk(
  "agentDashboard/fetchPropertyCount",
  async (agentId: string, { rejectWithValue }) => {
    try {
      const count = await Meteor.callAsync(
        MeteorMethodIdentifier.GET_AGENT_PROPERTY_COUNT,
        agentId
      );
      return count;
    } catch (error) {
      return rejectWithValue("Failed to fetch property count");
    }
  }
);

export const fetchPropertiesAndMetrics = createAsyncThunk(
  "agentDashboard/fetchPropertiesAndMetrics",
  async (agentId: string, { rejectWithValue }) => {
    try {
      const properties = (await Meteor.callAsync(
        MeteorMethodIdentifier.GET_ALL_AGENT_PROPERTIES,
        agentId
      )) as ApiProperty[];
      const occupiedProperties = properties.filter(
        (property) => property.propertyStatus === PropertyStatus.OCCUPIED
      );
      const totalRevenue = occupiedProperties.reduce(
        (sum, property) => sum + property.pricePerMonth,
        0
      );
      const occupancyRate =
        properties.length > 0
          ? (occupiedProperties.length / properties.length) * 100
          : 0;

      return {
        properties,
        monthlyRevenue: totalRevenue,
        occupancyRate,
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch properties and metrics");
    }
  }
);
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
              datetime: taskData.dueDate
                ? new Date(taskData.dueDate).toLocaleDateString()
                : "",
              status: taskData.status,
              priority: taskData.priority,
              taskId: taskData.taskId,
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
    setTasks: (state, action: PayloadAction<AgentDashboardState["tasks"]>) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Property Count
      .addCase(fetchPropertyCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.propertyCount = action.payload;
      })
      .addCase(fetchPropertyCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Properties and Metrics
      .addCase(fetchPropertiesAndMetrics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertiesAndMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload.properties;
        state.monthlyRevenue = action.payload.monthlyRevenue;
        state.occupancyRate = action.payload.occupancyRate;
      })
      .addCase(fetchPropertiesAndMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
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

export const { setTasks } = agentDashboardSlice.actions;
export const selectAgentDashboard = (state: RootState) => state.agentDashboard;
export const selectProperties = (state: RootState) =>
  state.agentDashboard.properties;
export const selectPropertyCount = (state: RootState) =>
  state.agentDashboard.propertyCount;
export const selectMonthlyRevenue = (state: RootState) =>
  state.agentDashboard.monthlyRevenue;
export const selectOccupancyRate = (state: RootState) =>
  state.agentDashboard.occupancyRate;
export const selectTasks = (state: RootState) => state.agentDashboard.tasks;
export const selectIsLoading = (state: RootState) =>
  state.agentDashboard.isLoading;
export const selectError = (state: RootState) => state.agentDashboard.error;

export default agentDashboardSlice.reducer;
