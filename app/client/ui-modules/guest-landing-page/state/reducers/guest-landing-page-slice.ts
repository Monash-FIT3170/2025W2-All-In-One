import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiListing } from "/app/shared/api-models/property-listing/ApiListing"; 
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";
import { apiGetListingForProperty } from "../../../../library-modules/apis/property-listing/listing-api";
import { GuestLandingPageUiState } from "../GuestLandingPageUiState"; 

const initialState: GuestLandingPageUiState = {
  isLoading: false,
  properties: [],
  error: null,
};

import { PropertyWithListing } from "../GuestLandingPageUiState";

export const fetchPropertiesAndListings = createAsyncThunk<
  PropertyWithListing[],
  void,
  { state: RootState }
>(
  "guestLandingPage/fetchPropertiesAndListings",
  async () => {
    const baseProperties: ApiProperty[] = await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET_ALL);


    const propertiesWithPotentialListings: (ApiProperty & { listing: ApiListing | null })[] = await Promise.all(
      baseProperties.map(async (property) => {
        const listing = await apiGetListingForProperty(property.propertyId);
        return { ...property, listing: listing };
      })
    );
    
    const propertiesWithListedStatus: PropertyWithListing[] = propertiesWithPotentialListings
      .filter((property): property is ApiProperty & { listing: ApiListing } => {
        return property.listing != null && property.listing.listing_status === ListingStatus.LISTED;
      })
      .map(property => ({ ...property, listing: property.listing! }));

    return propertiesWithListedStatus;
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
      .addCase(fetchPropertiesAndListings.fulfilled, (state, action: PayloadAction<PropertyWithListing[]>) => { // Changed PayloadAction type
        state.isLoading = false;
        state.properties = action.payload;
      })
      .addCase(fetchPropertiesAndListings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load properties";
      });
  },
});

export const selectGuestLandingPageUiState = (state: RootState) => state.guestLandingPage;


export const selectGuestLandingPageProperties = (state: RootState): PropertyWithListing[] => {
  return state.guestLandingPage.properties;
};

export default guestLandingPageSlice.reducer;