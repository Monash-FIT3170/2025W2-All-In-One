import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { fetchLandlordDashboardData } from "/app/client/library-modules/domain-models/property/repositories/property-repository";

interface LandlordDashboardState {
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

  dashboardData: {
    propertyCount: number;
    statusCounts: {
      occupied: number;
      vacant: number;
    };
    income: {
      weekly: number;
      monthly: number;
    };
    occupancyRate: number;
    averageRent: {
      occupiedCount: number;
      rent: number;
    };
  } | null;
  error: string | null;
}

const initialState: LandlordDashboardState = {
  isLoading: false,
  tasks: [],
  properties: [],
  dashboardData: null,
  error: null,
};

export const fetchLandlordTasks = createAsyncThunk(
  "landlordDashboard/fetchLandlordTasks",
  async (userId: string) => {
    // First, get the landlord data which includes task IDs
    const landlordResponse = await Meteor.callAsync(
      MeteorMethodIdentifier.LANDLORD_GET,
      userId
    );

    // Fetch task details for each task ID
    const taskDetails = [];
    if (landlordResponse.tasks && landlordResponse.tasks.length > 0) {
      for (const taskId of landlordResponse.tasks) {
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
      ...landlordResponse,
      taskDetails: taskDetails,
    };
  }
);

export const fetchLandlordDashboard = createAsyncThunk(
  "landlordDashboard/fetchLandlordDashboard",
  async (landlordId: string) => {
    const dashboardData = await fetchLandlordDashboardData(landlordId);
    
    return {
      propertyCount: dashboardData.totalPropertyCount,
      statusCounts: dashboardData.propertyStatusCounts,
      income: dashboardData.totalIncome,
      occupancyRate: dashboardData.occupancyRate,
      averageRent: dashboardData.averageRent,
    };
  }
);

interface Property {
  address: string;
  status: "Occupied" | "Vacant";
  rent: number;
}

export const landlordDashboardSlice = createSlice({
  name: "landlordDashboard",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTasks: (
      state,
      action: PayloadAction<LandlordDashboardState["tasks"]>
    ) => {
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
      .addCase(fetchLandlordTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLandlordTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        // Use the fetched task details
        state.tasks = action.payload.taskDetails || [];
      })
      .addCase(fetchLandlordTasks.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchLandlordDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLandlordDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchLandlordDashboard.rejected, (state) => {
        state.isLoading = false;
        state.error = "Failed to load landlord dashboard statistics.";
      });
  },
});

export const { setLoading, setTasks, setProperties, setError } =
  landlordDashboardSlice.actions;
export const selectLandlordDashboard = (state: RootState) =>
  state.landlordDashboard.dashboardData;

export const selectTasks = (state: RootState) => state.landlordDashboard.tasks;
export const selectProperties = (state: RootState) =>
  state.landlordDashboard.properties;
export const selectLoading = (state: RootState) =>
  state.landlordDashboard.isLoading;

export default landlordDashboardSlice.reducer;
