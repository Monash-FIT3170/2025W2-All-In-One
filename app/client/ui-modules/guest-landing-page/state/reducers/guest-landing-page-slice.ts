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
  isSidebarOpen: false,    
  visibleCount: 3,          
};


export const fetchPropertiesAndListings = createAsyncThunk<
  PropertyWithListingData[],
  void,
  { state: RootState }
>(
  "guestLandingPage/fetchPropertiesAndListings",
  async () => {
    const listedListings = await getAllListedListings();


    const propertyDataPromises = listedListings.map((listing) =>
      getPropertyWithListingDataUseCase(listing.apiListing.property_id));

    const allResults = await Promise.all(propertyDataPromises);

    return allResults
  }
);

export const guestLandingPageSlice = createSlice({
  name: "guestLandingPage",
  initialState,
  reducers: {
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },
    updateVisibleCount(state, action: PayloadAction<{ type: "set" | "increment", value: number }>) {
      if (action.payload.type === "set") {
        state.visibleCount = action.payload.value;
      } else if (action.payload.type === "increment") {
        state.visibleCount += action.payload.value;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertiesAndListings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertiesAndListings.fulfilled, (state, action: PayloadAction<PropertyWithListingData[]>) => {
        state.isLoading = false;
        state.properties = action.payload;
      })
      .addCase(fetchPropertiesAndListings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load properties";
      });
  },
});

export const {
  setSidebarOpen,
  updateVisibleCount
} = guestLandingPageSlice.actions;

export const selectGuestLandingPageUiState = (state: RootState) => state.guestLandingPage;

export default guestLandingPageSlice.reducer;