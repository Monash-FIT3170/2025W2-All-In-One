import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ListingStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingStatusPill";
import { PropertyStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingSummary";
import { PropertyListingPageUiState } from "/app/client/ui-modules/property-listing-page/state/PropertyListingUiState";

const initialState: PropertyListingPageUiState = {
  streetNumber: "",
  street: "",
  suburb: "",
  province: "",
  postcode: "",
  summaryDescription: "",
  propertyStatusText: "",
  propertyStatusPillVariant: PropertyStatusPillVariant.VACANT, // Assuming VACANT is a valid default
  propertyDescription: "",
  propertyFeatures: [],
  propertyType: "",
  propertyLandArea: "",
  propertyBathrooms: "",
  propertyParkingSpaces: "",
  propertyBedrooms: "",
  propertyPrice: "",
  inspectionBookingUiStateList: [],
  listingImageUrls: [],
  listingStatusText: "",
  listingStatusPillVariant: ListingStatusPillVariant.DRAFT, // Assuming DRAFT is a valid default
  shouldDisplayListingStatus: false,
  shouldDisplaySubmitDraftButton: false,
};

export const propertyListingSlice = createSlice({
  name: "propertyListing",
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
  }
})

// TEMP: Id used for property will be 1. To be changed to a dynamic id given how listing is structured in the future
export const loadProperty = createAsyncThunk(
  "propertyListing/loadProperty",
  async (propertyId: string) => {
  }
)