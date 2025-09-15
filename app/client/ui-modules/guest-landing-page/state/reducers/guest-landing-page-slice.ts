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
    return allResults.filter(
      (property) => property.propertyStatus === "VACANT"
    );
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
        const skip = action.meta.arg.skip;
        if (skip === 0) {
          state.properties = action.payload;
        } else {
          const existingIds = new Set(state.properties.map((p) => p.propertyId));
          const newProperties = action.payload.filter(
            (p) => !existingIds.has(p.propertyId)
          );
          state.properties = [...state.properties, ...newProperties];
        }
      })
      .addCase(fetchPropertiesAndListings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load properties";
      });
  },
});

export const selectGuestLandingPageUiState = (state: RootState) => state.guestLandingPage;

export default guestLandingPageSlice.reducer;