import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { Meteor } from 'meteor/meteor';
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';
import { ApiProperty } from '/app/shared/api-models/property/ApiProperty';
import { getPropertyList } from "../../../../library-modules/apis/property/property-api";


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
  propertyList: ApiProperty[];
  propertyListLoading: boolean;
  propertyListError: string | null;
};
const initialState: AgentDashboardState = {
  isLoading: false,
  properties: [],
  propertyCount: 0,
  monthlyRevenue: 0,
  occupancyRate: 0,
  tasks: [],
  error: null,
  propertyList: [] as ApiProperty[],
  propertyListLoading: false,
  propertyListError: null as string | null,
};

// Async thunks
export const fetchPropertyCount = createAsyncThunk(
  'agentDashboard/fetchPropertyCount',
  async (agentId: string, { rejectWithValue }) => {
    try {
      const count = await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET_COUNT, agentId);
      return count;
    } catch (error) {
      return rejectWithValue('Failed to fetch property count');
    }
  }
);

export const fetchPropertiesAndMetrics = createAsyncThunk(
  'agentDashboard/fetchPropertiesAndMetrics',
  async (agentId: string, { rejectWithValue }) => {
    try {
      const properties = await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET_LIST, agentId) as ApiProperty[];
      const occupiedProperties = properties.filter(property => property.propertyStatus === "Occupied");
      const totalRevenue = occupiedProperties.reduce((sum, property) => sum + property.pricePerMonth, 0);
      const occupancyRate = properties.length > 0 ? (occupiedProperties.length / properties.length) * 100 : 0;

      return {
        properties,
        monthlyRevenue: totalRevenue,
        occupancyRate
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch properties and metrics');
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

export const loadPropertyList = createAsyncThunk(
  "agentDashboard/loadPropertyList",
  async (agentId: string) => {
    const properties = await getPropertyList(agentId);
    return properties;
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
      })
      .addCase(loadPropertyList.pending, (state) => {
        state.propertyListLoading = true;
        state.propertyListError = null;
      })
      .addCase(loadPropertyList.fulfilled, (state, action) => {
        state.propertyList = action.payload;
        state.propertyListLoading = false;
      })
      .addCase(loadPropertyList.rejected, (state, action) => {
        state.propertyListLoading = false;
        state.propertyListError = action.error.message || "Failed to load properties";
      });
  },
});

// Type the root state to include our slice
type RootStateWithAgentDashboard = RootState & {
  agentDashboard: AgentDashboardState;
};

// Update selectors with proper typing
export const selectAgentDashboard = (state: RootStateWithAgentDashboard) => state.agentDashboard;
export const selectProperties = (state: RootStateWithAgentDashboard) => state.agentDashboard.properties;
export const selectPropertyCount = (state: RootStateWithAgentDashboard) => state.agentDashboard.propertyCount;
export const selectMonthlyRevenue = (state: RootStateWithAgentDashboard) => state.agentDashboard.monthlyRevenue;
export const selectOccupancyRate = (state: RootStateWithAgentDashboard) => state.agentDashboard.occupancyRate;
export const selectTasks = (state: RootStateWithAgentDashboard) => state.agentDashboard.tasks;
export const selectIsLoading = (state: RootStateWithAgentDashboard) => state.agentDashboard.isLoading;
export const selectError = (state: RootStateWithAgentDashboard) => state.agentDashboard.error;
export const selectPropertyList = (state: RootStateWithAgentDashboard) => state.agentDashboard.propertyList;
export const selectPropertyListLoading = (state: RootStateWithAgentDashboard) => state.agentDashboard.propertyListLoading;
export const selectPropertyListError = (state: RootStateWithAgentDashboard) => state.agentDashboard.propertyListError;

export default agentDashboardSlice.reducer;
