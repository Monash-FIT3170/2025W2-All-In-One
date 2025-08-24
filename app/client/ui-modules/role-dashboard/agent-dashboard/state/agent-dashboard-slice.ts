import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { getAgentById } from "/app/client/library-modules/domain-models/user/role-repositories/agent-repository";
import { getTaskById } from "/app/client/library-modules/domain-models/task/repositories/task-repository";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { getPropertyByAgentId } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { PropertyOption } from "../components/TaskFormSchema";
import { getPropertyById } from "/app/client/library-modules/domain-models/property/repositories/property-repository";

interface AgentDashboardState {
  isLoading: boolean;
  propertiesLoading: boolean;
  properties: Property[];
  propertyCount: number;
  monthlyRevenue: number;
  occupancyRate: number;
  tasks: Task[];
  markers: { latitude: number; longitude: number }[];
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
  markers: [],
  error: null,
  propertiesError: null,
};

// Async thunks
export const fetchAgentDetails = createAsyncThunk(
  "agentDashboard/fetchProperties",
  async (userId: string) => {
    let properties;
    let tasks;
    try {
      const agent = await getAgentById(userId);
      properties = await getPropertyByAgentId(agent.agentId);
      tasks = await Promise.all(
        agent.tasks.map((taskId) => {
          return getTaskById(taskId);
        })
      );

      return {
        properties: properties,
        tasks: tasks,
      };
    } catch (error) {
      console.error("Error fetching agent details:", error);
      throw new Meteor.Error("Failed to fetch agent properties");
    }
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

export const fetchMarkersForDate = createAsyncThunk(
  "agentDashboard/fetchMarkersForDate",
  async (args: { tasks: Task[]; selectedDateISO?: string }) => {
    const { tasks, selectedDateISO } = args;
    const todayISO = new Date().toISOString().split("T")[0];

    const tasksForSelectedDate = tasks.filter(
      (task) => task.dueDate === (selectedDateISO || todayISO)
    );

    const markers = await Promise.all(
      tasksForSelectedDate.map(async (task) => {
        if (!task.propertyId) return null;
        try {
          const property = await getPropertyById(task.propertyId);
          if (
            property.locationLatitude != null &&
            property.locationLongitude != null
          ) {
            return {
              latitude: property.locationLatitude,
              longitude: property.locationLongitude,
            };
          }
        } catch (err) {
          console.error(`Error fetching property ${task.propertyId}:`, err);
        }
        return null;
      })
    );

    return markers.filter(Boolean) as { latitude: number; longitude: number }[];
  }
);

export const fetchPropertiesAndMetrics = createAsyncThunk(
  "agentDashboard/fetchPropertiesAndMetrics",
  async (agentId: string, { rejectWithValue }) => {
    try {
      const properties = await getPropertyByAgentId(agentId);
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
    const agentResponse = await getAgentById(userId);
    console.log("fetching agent tasks");
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
      // Agent Properties
      .addCase(fetchAgentDetails.pending, (state) => {
        state.propertiesLoading = true;
        state.propertiesError = null;
      })
      .addCase(fetchAgentDetails.fulfilled, (state, action) => {
        state.propertiesLoading = false;
        state.properties = action.payload.properties;
        state.tasks = action.payload.tasks || [];
      })
      .addCase(fetchAgentDetails.rejected, (state, action) => {
        state.propertiesLoading = false;
        state.propertiesError =
          action.error.message || "Failed to fetch agent properties";
      })
      .addCase(fetchMarkersForDate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMarkersForDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.markers = action.payload;
      })
      .addCase(fetchMarkersForDate.rejected, (state) => {
        state.isLoading = false;
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
export const selectMarkers = (state: RootState) => state.agentDashboard.markers;

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

export const fetchPropertiesForAgent = (
  agentId: string
): Promise<PropertyOption[]> => {
  return new Promise((resolve, reject) => {
    Meteor.call(
      MeteorMethodIdentifier.PROPERTY_GET_ALL_BY_AGENT_ID,
      agentId,
      (err: Meteor.Error | null, result: any[]) => {
        if (err) {
          reject(err);
        } else {
          // Map full property objects to lightweight PropertyOption[]
          const properties: PropertyOption[] = (result || []).map((p) => ({
            _id: p._id,
            propertyId: p.propertyId,
            streetnumber: p.streetnumber,
            streetname: p.streetname,
            suburb: p.suburb,
          }));
          resolve(properties);
        }
      }
    );
  });
};
