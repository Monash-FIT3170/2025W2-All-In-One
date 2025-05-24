import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

export type GuestLandingPageUiState = {
  isLoading: boolean;
  properties: ApiProperty[];
  error: string | null;
};

const initialState: GuestLandingPageUiState = {
  isLoading: false,
  properties: [],
  error: null,
};

// Async thunk to fetch properties from the server
export const fetchProperties = createAsyncThunk(
  "guestLandingPage/fetchProperties",
  async () => {
    const response = await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET_ALL_LISTED);

    const safeSerializeDate = (dateInput: Date | string): string => {
      if (dateInput instanceof Date) {
        if (!isNaN(dateInput.getTime())) {
          return dateInput.toISOString();
        } else {
          return "Invalid Date"; 
        }
      }
  
      return dateInput;
    };

    const propertiesWithSerializableDates = (response as ApiProperty[]).map(property => ({
      ...property,
      inspections: property.inspections?.map(inspection => ({
        ...inspection,
        start_time: safeSerializeDate(inspection.start_time),
        end_time: safeSerializeDate(inspection.end_time),
      })),
    }));
    return propertiesWithSerializableDates;
  }
);


export const guestLandingPageSlice = createSlice({
  name: "guestLandingPage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action: PayloadAction<ApiProperty[]>) => {
        state.isLoading = false;        
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load properties";
      });
  },
});

export const selectGuestLandingPageUiState = (state: RootState) => state.guestLandingPage;

export default guestLandingPageSlice.reducer;
