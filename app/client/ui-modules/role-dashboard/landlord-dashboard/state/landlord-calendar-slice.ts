import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { getLandlordById } from "/app/client/library-modules/domain-models/user/role-repositories/landlord-repository";
import { getTaskById } from "/app/client/library-modules/domain-models/task/repositories/task-repository";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { PropertyOption } from "../../agent-dashboard/components/TaskFormSchema";
import { getPropertyById } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { apiDeleteTaskForLandlord } from "/app/client/library-modules/apis/task/task-api";

interface LandlordCalendarState {
  tasks: Task[];
  markers: { latitude: number; longitude: number }[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LandlordCalendarState = {
  tasks: [],
  markers: [],
  isLoading: false,
  error: null,
};

export const fetchLandlordCalendarTasks = createAsyncThunk(
  "landlordCalendar/fetchLandlordCalendarTasks",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const userId = state.currentUser.authUser?.userId;

    if (!userId) {
      throw new Error("No current user");
    }

    const landlordResponse = await getLandlordById(userId);
    console.log("fetching landlord calendar tasks");

    // Fetch all tasks in parallel
    const taskDetailsResults = await Promise.all(
      landlordResponse.tasks.map(async (taskId) => {
        try {
          return await getTaskById(taskId);
        } catch (error) {
          console.error(`Error fetching task ${taskId}:`, error);
          return null; // skip failed tasks
        }
      })
    );

    // Filter out any null results
    const taskDetails: Task[] = taskDetailsResults.filter(
      (task): task is Task => task !== null
    );

    return taskDetails;
  }
);

export const fetchLandlordCalendarMarkersForDate = createAsyncThunk(
  "landlordCalendar/fetchLandlordCalendarMarkersForDate",
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

export const deleteLandlordCalendarTask = createAsyncThunk(
  "landlordCalendar/deleteLandlordCalendarTask",
  async (args: { taskId: string; landlordId: string }, { getState }) => {
    try {
      const result = await apiDeleteTaskForLandlord({
        taskId: args.taskId,
        landlordId: args.landlordId
      });
      
      if (result) {
        return args.taskId; // Return the deleted task ID for removal from state
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting landlord task:", error);
      throw error;
    }
  }
);

export const landlordCalendarSlice = createSlice({
  name: "landlordCalendar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLandlordCalendarTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLandlordCalendarTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload || [];
      })
      .addCase(fetchLandlordCalendarTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch landlord calendar tasks";
      })
      .addCase(fetchLandlordCalendarMarkersForDate.pending, (state) => {
        // Don't set loading for markers to avoid blocking UI
      })
      .addCase(fetchLandlordCalendarMarkersForDate.fulfilled, (state, action) => {
        state.markers = action.payload;
      })
      .addCase(fetchLandlordCalendarMarkersForDate.rejected, (state, action) => {
        console.error("Failed to fetch landlord calendar markers:", action.error.message);
      })
      .addCase(deleteLandlordCalendarTask.pending, (state) => {
        // Keep UI responsive during delete
      })
      .addCase(deleteLandlordCalendarTask.fulfilled, (state, action) => {
        // Remove the deleted task from state
        state.tasks = state.tasks.filter(task => task.taskId !== action.payload);
      })
      .addCase(deleteLandlordCalendarTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete task";
      });
  },
});

// No manual actions exported - all state updates handled through async thunks

// Selectors
export const selectLandlordCalendar = (state: RootState) => state.landlordCalendar;
export const selectLandlordCalendarTasks = (state: RootState) => state.landlordCalendar.tasks;
export const selectLandlordCalendarLoading = (state: RootState) => state.landlordCalendar.isLoading;
export const selectLandlordCalendarMarkers = (state: RootState) => state.landlordCalendar.markers;
export const selectLandlordCalendarError = (state: RootState) => state.landlordCalendar.error;

export default landlordCalendarSlice.reducer;

// Utility function for fetching properties (moved from main dashboard slice)
export const fetchPropertiesForLandlordCalendar = (
  landlordId: string
): Promise<PropertyOption[]> => {
  return new Promise((resolve, reject) => {
    Meteor.call(
      MeteorMethodIdentifier.PROPERTY_GET_ALL_BY_LANDLORD_ID,
      landlordId,
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
