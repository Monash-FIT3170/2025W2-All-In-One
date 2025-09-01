import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { getLandlordById } from "/app/client/library-modules/domain-models/user/role-repositories/landlord-repository";
import { getTaskById } from "/app/client/library-modules/domain-models/task/repositories/task-repository";
import {
  fetchLandlordDashboardData,
  getAllPropertiesByLandlordId,
} from "/app/client/library-modules/domain-models/property/repositories/property-repository";

import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { PropertyOption } from "../../agent-dashboard/components/TaskFormSchema";

interface LandlordDashboardState {
  isLoading: boolean;
  properties: Property[];
  tasks: Task[];
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
  };
  error: string | null;
}

const initialState: LandlordDashboardState = {
  isLoading: false,
  tasks: [],
  properties: [],
  dashboardData: {
    propertyCount: 0,
    statusCounts: {
      occupied: 0,
      vacant: 0,
    },
    income: {
      weekly: 0,
      monthly: 0,
    },
    occupancyRate: 0,
    averageRent: {
      occupiedCount: 0,
      rent: 0,
    },
  },
  error: null,
};

export const fetchLandlordTasks = createAsyncThunk(
  "landlordDashboard/fetchLandlordTasks",
  async (userId: string) => {
    const landlordResponse = await getLandlordById(userId);
    console.log("fetching landlord tasks");
    const taskDetails = [];
    for (const taskId of landlordResponse.tasks) {
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
      ...landlordResponse,
      taskDetails: taskDetails,
    };
  }
);


export const fetchLandlordDetails = createAsyncThunk(
  "landlordDashboard/fetchLandlordDetails",
  async (userId: string) => {
    let properties;
    let taskDetails;
    try {
      const landlordResponse = await getLandlordById(userId);
      const landlordId = landlordResponse?.landlordId;
      properties = await getAllPropertiesByLandlordId(
        landlordResponse.landlordId
      );
      taskDetails = await Promise.all(
        landlordResponse.tasks.map((taskId) => {
          return getTaskById(taskId);
        })
      );
      const dashboardData = await fetchLandlordDashboardData(landlordId);

      return {
        properties: properties,
        taskDetails: taskDetails,
        propertyCount: dashboardData.totalPropertyCount,
        statusCounts: dashboardData.propertyStatusCounts,
        income: dashboardData.totalIncome,
        occupancyRate: dashboardData.occupancyRate,
        averageRent: dashboardData.averageRent,
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
        state.tasks = action.payload.taskDetails || [];
        state.properties = action.payload.properties || [];
        state.dashboardData = {
          propertyCount: action.payload.propertyCount,
          statusCounts: action.payload.statusCounts,
          income: action.payload.income,
          occupancyRate: action.payload.occupancyRate,
          averageRent: action.payload.averageRent,
        };
      })
      .addCase(fetchLandlordDetails.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchLandlordTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLandlordTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.taskDetails || [];
      })
      .addCase(fetchLandlordTasks.rejected, (state) => {
        state.isLoading = false;
        state.error = "Failed to fetch agent tasks";
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


export const fetchPropertiesForLandlord = (
  agentId: string
): Promise<PropertyOption[]> => {
  return new Promise((resolve, reject) => {
    Meteor.call(
      MeteorMethodIdentifier.PROPERTY_GET_ALL_BY_LANDLORD_ID,
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

