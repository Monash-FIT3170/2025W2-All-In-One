import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { getAgentById } from "/app/client/library-modules/domain-models/user/role-repositories/agent-repository";
import { getTaskById } from "/app/client/library-modules/domain-models/task/repositories/task-repository";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { PropertyOption } from "../components/TaskFormSchema";
import { getPropertyById } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { apiDeleteTaskForAgent } from "/app/client/library-modules/apis/task/task-api";

interface AgentCalendarState {
  tasks: Task[];
  markers: { latitude: number; longitude: number }[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AgentCalendarState = {
  tasks: [],
  markers: [],
  isLoading: false,
  error: null,
};

export const fetchAgentCalendarTasks = createAsyncThunk(
  "agentCalendar/fetchAgentCalendarTasks",
  async (userId: string) => {
    const agentResponse = await getAgentById(userId);
    console.log("fetching agent calendar tasks");
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

    return taskDetails;
  }
);

export const fetchCalendarMarkersForDate = createAsyncThunk(
  "agentCalendar/fetchCalendarMarkersForDate",
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

export const deleteCalendarTask = createAsyncThunk(
  "agentCalendar/deleteCalendarTask",
  async (args: { taskId: string; agentId: string }, { getState }) => {
    try {
      const result = await apiDeleteTaskForAgent({
        taskId: args.taskId,
        agentId: args.agentId
      });
      
      if (result) {
        return args.taskId; // Return the deleted task ID for removal from state
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting agent task:", error);
      throw error;
    }
  }
);

export const agentCalendarSlice = createSlice({
  name: "agentCalendar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgentCalendarTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAgentCalendarTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload || [];
      })
      .addCase(fetchAgentCalendarTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch agent calendar tasks";
      })
      .addCase(fetchCalendarMarkersForDate.pending, (state) => {
        // Don't set loading for markers to avoid blocking UI
      })
      .addCase(fetchCalendarMarkersForDate.fulfilled, (state, action) => {
        state.markers = action.payload;
      })
      .addCase(fetchCalendarMarkersForDate.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch calendar markers";
      })
      .addCase(deleteCalendarTask.pending, (state) => {
        // Keep UI responsive during delete
      })
      .addCase(deleteCalendarTask.fulfilled, (state, action) => {
        // Remove the deleted task from state
        state.tasks = state.tasks.filter(task => task.taskId !== action.payload);
      })
      .addCase(deleteCalendarTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete task";
      });
  },
});

// No manual actions exported - all state updates handled through async thunks

// Selectors
export const selectAgentCalendar = (state: RootState) => state.agentCalendar;
export const selectCalendarTasks = (state: RootState) => state.agentCalendar.tasks;
export const selectCalendarLoading = (state: RootState) => state.agentCalendar.isLoading;
export const selectCalendarMarkers = (state: RootState) => state.agentCalendar.markers;
export const selectCalendarError = (state: RootState) => state.agentCalendar.error;

export default agentCalendarSlice.reducer;

// Utility function for fetching properties (moved from main dashboard slice)
export const fetchPropertiesForAgentCalendar = (
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
