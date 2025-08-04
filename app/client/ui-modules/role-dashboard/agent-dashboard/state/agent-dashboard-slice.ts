import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { getAgentById } from "/app/client/library-modules/domain-models/user/role-repositories/agent-repository";
import { getTaskById } from "/app/client/library-modules/domain-models/task/repositories/task-repository";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { getPropertyByAgentId } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { Property } from "/app/client/library-modules/domain-models/property/Property";

interface AgentDashboardState {
  isLoading: boolean;
  propertiesLoading: boolean;
  properties: Property[];
  propertyCount: number;
  monthlyRevenue: number;
  occupancyRate: number;
  tasks: Task[];
  error: string | null;
  propertiesError: string | null;
}
const initialState: AgentDashboardState = {
  isLoading: false,
  propertiesLoading: false,
  properties: [],
  propertyCount: 0,
  monthlyRevenue: 0,
  occupancyRate: 0,
  tasks: [],
  error: null,
  propertiesError: null,
};

// Async thunks

// Fetch agent's properties
export const fetchAgentProperties = createAsyncThunk<Property[], string>(
  "agentDashboard/fetchProperties",
  async (agentId: string) => {
    return await getPropertyByAgentId(agentId);
  }
);
export const fetchPropertyCount = createAsyncThunk(
  "agentDashboard/fetchPropertyCount",
  async (agentId: string, { rejectWithValue }) => {
    try {
      const count = await Meteor.callAsync(
        MeteorMethodIdentifier.PROPERTY_GET_COUNT,
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
        MeteorMethodIdentifier.PROPERTY_GET_LIST,
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
export const fetchAgentDetails = createAsyncThunk(
  "agentDashboard/fetchAgentDetails",
  async (userId: string) => {
    const agentResponse = await getAgentById(userId);

    const taskDetails = [];
    for (const taskId of agentResponse.tasks) {
      try {
        const taskData = await getTaskById(taskId);

        if (taskData) {
          // Format the task data for display
          taskDetails.push(taskData);
        }
      } catch (error) {
        console.error(`Error fetching task ${taskId}:`, error);
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
  reducers: {},
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
      // Agent Tasks
      .addCase(fetchAgentDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAgentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        // Use the fetched task details
        state.tasks = action.payload.taskDetails || [];
      })
      .addCase(fetchAgentDetails.rejected, (state) => {
        state.isLoading = false;
      })
      // Agent Properties
      .addCase(fetchAgentProperties.pending, (state) => {
        state.propertiesLoading = true;
        state.propertiesError = null;
      })
      .addCase(fetchAgentProperties.fulfilled, (state, action) => {
        state.propertiesLoading = false;
        state.properties = action.payload;
      })
      .addCase(fetchAgentProperties.rejected, (state, action) => {
        state.propertiesLoading = false;
        state.propertiesError =
          action.error.message || "Failed to fetch agent properties";
      });
  },
});

export const selectAgentDashboard = (state: RootState) => state.agentDashboard;
export const selectPropertyCount = (state: RootState) =>
  state.agentDashboard.propertyCount;
export const selectMonthlyRevenue = (state: RootState) =>
  state.agentDashboard.monthlyRevenue;
export const selectOccupancyRate = (state: RootState) =>
  state.agentDashboard.occupancyRate;

// Selectors for agent tasks
export const selectTasks = (state: RootState) => state.agentDashboard.tasks;
export const selectIsLoading = (state: RootState) =>
  state.agentDashboard.isLoading;
export const selectError = (state: RootState) => state.agentDashboard.error;

//Selectors for agent properties
export const selectProperties = (state: RootState) =>
  state.agentDashboard.properties;
export const selectPropertiesLoading = (state: RootState) =>
  state.agentDashboard.propertiesLoading;
export const selectPropertiesError = (state: RootState) =>
  state.agentDashboard.propertiesError;

export default agentDashboardSlice.reducer;
