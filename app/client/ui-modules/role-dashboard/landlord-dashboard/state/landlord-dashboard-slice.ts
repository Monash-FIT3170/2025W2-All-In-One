import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { getLandlordById } from "/app/client/library-modules/domain-models/user/role-repositories/landlord-repository";
import { getTaskById } from "/app/client/library-modules/domain-models/task/repositories/task-repository";
import { getAllPropertiesByLandlordId } from "/app/client/library-modules/domain-models/property/repositories/property-repository";

interface LandlordDashboardState {
  isLoading: boolean;
  properties: Property[];
  tasks: Task[];
  error: string | null;
}

const initialState: LandlordDashboardState = {
  isLoading: false,
  tasks: [],
  properties: [],
  error: null,
};
export const fetchLandlordProperties = createAsyncThunk(
  "landlordDashboard/fetchLandlordProperties",  
  async (landlordId: string) => {
    // Fetch properties for the landlord
    const properties = await getAllPropertiesByLandlordId(landlordId);
    return properties;
  }
)
export const fetchLandlordDetails = createAsyncThunk(
  "landlordDashboard/fetchLandlordDetails",
  async (userId: string) => {
    let properties;
    let taskDetails;
    // First, get the landlord data which includes task IDs
    try{
      const landlordResponse = await getLandlordById(userId);
    
      // Fetch task details for each task ID
      taskDetails = await Promise.all(landlordResponse.tasks.map(async (taskId) => {
        const task = await getTaskById(taskId);
        return task;
      }));
      properties = await getAllPropertiesByLandlordId(userId);  
    return {
      properties: properties,
      taskDetails: taskDetails,
    };
  } catch (error) {
      console.error("Error fetching landlord details:", error);
      throw new Meteor.Error("Failed to fetch landlord properties");
  }
}
);

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
      .addCase(fetchLandlordDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLandlordDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        // Use the fetched task details
        state.tasks = action.payload.taskDetails || [];
        state.properties = action.payload.properties || [];
      })
      .addCase(fetchLandlordDetails.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchLandlordProperties.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchLandlordProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload;
      })
      .addCase(fetchLandlordProperties.rejected, (state) => {
        state.isLoading = false;
      }); 
  },
});

export const { setLoading, setTasks, setProperties, setError } =
  landlordDashboardSlice.actions;

export const selectLandlordDashboard = (state: RootState) =>
  state.landlordDashboard;
export const selectTasks = (state: RootState) => state.landlordDashboard.tasks;
export const selectProperties = (state: RootState) =>
  state.landlordDashboard.properties;
export const selectLoading = (state: RootState) =>
  state.landlordDashboard.isLoading;
export default landlordDashboardSlice.reducer;
