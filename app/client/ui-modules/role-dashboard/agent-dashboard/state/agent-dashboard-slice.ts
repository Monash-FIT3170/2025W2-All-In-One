import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { Meteor } from 'meteor/meteor';
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';
import { ApiProperty } from '/app/shared/api-models/property/ApiProperty';

interface Property {
  address: string;
  status: "Closed" | "Maintenance" | "Draft" | "Listed";
  rent: number;
}

interface AgentDashboardState {
  isLoading: boolean;
  properties: Property[];
  propertyCount: number;
  monthlyRevenue: number;
  occupancyRate: number;
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
  propertyCount: 0,
  monthlyRevenue: 0,
  occupancyRate: 0,
  tasks: [],
  error: null,
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
      });
  },
});

export const { setTasks } = agentDashboardSlice.actions;

// Selectors
export const selectAgentDashboard = (state: RootState) => state.agentDashboard;
export const selectProperties = (state: RootState) => state.agentDashboard.properties;
export const selectPropertyCount = (state: RootState) => state.agentDashboard.propertyCount;
export const selectMonthlyRevenue = (state: RootState) => state.agentDashboard.monthlyRevenue;
export const selectOccupancyRate = (state: RootState) => state.agentDashboard.occupancyRate;
export const selectTasks = (state: RootState) => state.agentDashboard.tasks;
export const selectIsLoading = (state: RootState) => state.agentDashboard.isLoading;
export const selectError = (state: RootState) => state.agentDashboard.error;

export default agentDashboardSlice.reducer;