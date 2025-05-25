import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

interface LandlordDashboardState {
  isLoading: boolean;
  tasks: Array<{
    title: string;
    address: string;
    datetime: string;
    status: string;
    description?: string;
    priority?: string;
    taskId?: string;
  }>;
  properties: Property[];
  error: string | null;
}

const initialState: LandlordDashboardState = {
  isLoading: false,
  tasks: [],
  properties: [],
  error: null,
};

interface Property {
  address: string;
  status: "Occupied" | "Vacant";
  rent: number;
}


export const fetchLandlordTasks = createAsyncThunk(
  "landlordLandlordDashboard/fetchTasks", async (userId: string) =>{
    //get the tenant data which has the task IDs
    const landlordResponse = await Meteor.callAsync(
      MeteorMethodIdentifier.LANDLORD_GET, userId
    );
    // console.log(tenantResponse)

    //fetch task details for each task Id
    const taskDetails = [];
    if (landlordResponse.tasks && landlordResponse.tasks.length > 0){
      for (const taskId of landlordResponse.tasks){
        try{
          //fetch task detail using TASK_GET method
          const taskData = await Meteor.callAsync(
            MeteorMethodIdentifier.TASK_GET, taskId
          );
          if (taskData){
            taskDetails.push({
              title: taskData.name,
              description: taskData.description,
              datetime: taskData.dueDate ? new Date(taskData.dueDate).toLocaleDateString() : '',
              status: taskData.status,
              priority: taskData.priority,
              taskId: taskData.taskId
            });
          }
        } catch (error){
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

export const landlordDashboardSlice = createSlice({
  name: "landlordDashboard",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTasks: (state, action: PayloadAction<LandlordDashboardState["tasks"]>) => {
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
      });
  },
});

export const { setLoading, setTasks, setProperties, setError } = landlordDashboardSlice.actions;

export const selectLandlordDashboard = (state: RootState) => state.landlordDashboard;
export const selectTasks = (state: RootState) => state.landlordDashboard.tasks;
export const selectProperties = (state: RootState) => state.landlordDashboard.properties;

export default landlordDashboardSlice.reducer;