import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { GuestLandingPageUiState } from "../GuestLandingPageUiState";
import { PropertyWithListingData } from "/app/client/library-modules/use-cases/property-listing/models/PropertyWithListingData";
import { getPropertyWithListingDataUseCase } from "/app/client/library-modules/use-cases/property-listing/GetPropertyWithListingDataUseCase";
import { getAllListedListings } from "/app/client/library-modules/domain-models/property-listing/repositories/listing-repository";

const initialState: GuestLandingPageUiState = {
  isLoading: false,
  properties: [],
  error: null,
};


export const fetchPropertiesAndListings = createAsyncThunk<
  PropertyWithListingData[],
  { skip: number; limit: number },
  { state: RootState }
>(
  "guestLandingPage/fetchPropertiesAndListings",
  async ({ skip, limit }) => {
    const listedListings = await getAllListedListings(skip, limit);
    const propertyDataPromises = listedListings.map((listing) =>
      getPropertyWithListingDataUseCase(listing.apiListing.property_id)
    );
    const allResults = await Promise.all(propertyDataPromises);
    return allResults;
  }
);

export const guestLandingPageSlice = createSlice({
  name: "guestLandingPage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertiesAndListings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertiesAndListings.fulfilled, (state, action) => {
        state.isLoading = false;
<<<<<<< HEAD
        // Convert Date objects to strings to make them serializable
        state.properties = action.payload.map(property => ({
          ...property,
          inspections: property.inspections.map(inspection => ({
            start_time: inspection.start_time instanceof Date ? inspection.start_time.toISOString() : inspection.start_time,
            end_time: inspection.end_time instanceof Date ? inspection.end_time.toISOString() : inspection.end_time,
          }))
        }));
=======
        const skip = action.meta.arg.skip;
        if (skip === 0) {
          state.properties = action.payload;
        } else {
          state.properties = [...state.properties, ...action.payload];
        }
>>>>>>> 8cf3b93070b51985548ba5af1530fa226da84255
      })
      .addCase(fetchPropertiesAndListings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load properties";
      });
  },
});

export const selectGuestLandingPageUiState = (state: RootState) => state.guestLandingPage;

export default guestLandingPageSlice.reducer;