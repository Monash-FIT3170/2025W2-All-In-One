import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";

interface LandlordDashboardState {
  isLoading: boolean;
  tasks: Array<{
    title: string;
    address: string;
    datetime: string;
    status: "Upcoming" | "Due Soon" | "Overdue";
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
});

export const { setLoading, setTasks, setProperties, setError } = landlordDashboardSlice.actions;

export const selectLandlordDashboard = (state: RootState) => state.landlordDashboard;
export const selectTasks = (state: RootState) => state.landlordDashboard.tasks;
export const selectProperties = (state: RootState) => state.landlordDashboard.properties;

export default landlordDashboardSlice.reducer;