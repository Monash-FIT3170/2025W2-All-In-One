import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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
  tasksCount: number;
  tasksDueThisWeek: number;
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
  tasksCount: 0,
  tasksDueThisWeek: 0,
};

export const fetchAgentDetails = createAsyncThunk(
  "agentDashboard/fetchAgentDetails",
  async (userId: string) => {
    try {
      const agentResponse = await getAgentById(userId);

      // fetch properties + calculate metrics
      const properties = await getPropertyByAgentId(agentResponse.agentId);
      const propertyCount = properties.length;

      const occupiedProperties = properties.filter(
        (p) => p.propertyStatus === PropertyStatus.OCCUPIED
      );
      const monthlyRevenue = occupiedProperties.reduce(
        (sum, p) => sum + p.pricePerMonth,
        0
      );
      const occupancyRate =
        properties.length > 0
          ? (occupiedProperties.length / properties.length) * 100
          : 0;

      // fetch tasks + calculate metrics
      const taskDetails = await Promise.all(
        agentResponse.tasks.map((taskId) => getTaskById(taskId))
      );

      const tasksCount = taskDetails.length;
      const startofWeek = new Date();
      startofWeek.setDate(startofWeek.getDate() - startofWeek.getDay() + 1); //Monday
      const endofWeek = new Date(startofWeek);
      endofWeek.setDate(startofWeek.getDate() + 6); //Sunday

      const tasksDueThisWeek = taskDetails.filter((task) => {
        const due = new Date(task.dueDate);
        return due >= startofWeek && due <= endofWeek;
      }).length;

      return {
        properties,
        propertyCount,
        monthlyRevenue,
        occupancyRate,
        taskDetails,
        tasksCount,
        tasksDueThisWeek,
      };
    } catch (error) {
      console.error("Error fetching agent details:", error);
      throw new Meteor.Error("Failed to fetch agent properties");
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

export const agentDashboardSlice = createSlice({
  name: "agentDashboard",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTasks: (state, action: PayloadAction<AgentDashboardState["tasks"]>) => {
      state.tasks = action.payload;
    },
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgentDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAgentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.taskDetails || [];
        state.properties = action.payload.properties || [];
        state.propertyCount = action.payload.propertyCount;
        state.occupancyRate = action.payload.occupancyRate;
        state.monthlyRevenue = action.payload.monthlyRevenue;
        state.tasksCount = action.payload.tasksCount;
        state.tasksDueThisWeek = action.payload.tasksDueThisWeek;
      })

      .addCase(fetchAgentDetails.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAgentTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAgentTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.taskDetails || [];
      })
      .addCase(fetchAgentTasks.rejected, (state) => {
        state.isLoading = false;
        state.error = "Failed to fetch agent tasks";
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

export const { setLoading, setTasks, setProperties, setError } =
  agentDashboardSlice.actions;

export const selectAgentDashboard = (state: RootState) => state.agentDashboard;
export const selectTasks = (state: RootState) => state.agentDashboard.tasks;
export const selectProperties = (state: RootState) =>
  state.agentDashboard.properties;
export const selectLoading = (state: RootState) =>
  state.agentDashboard.isLoading;
export const selectMarkers = (state: RootState) => state.agentDashboard.markers;
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
