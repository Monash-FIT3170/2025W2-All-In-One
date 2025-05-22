import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListingStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingStatusPill";
import { PropertyStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingSummary";
import { PropertyListingPageUiState } from "/app/client/ui-modules/property-listing-page/state/PropertyListingUiState";
import { getPropertyWithListingDataUseCase } from "/app/client/library-modules/use-cases/property-listing/GetPropertyWithListingDataUseCase";
import {
  getFormattedDateStringFromDate,
  getFormattedTimeStringFromDate,
} from "/app/client/library-modules/utils/date-utils";
import { RootState } from "/app/client/store";
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";

const initialState: PropertyListingPageUiState = {
  streetNumber: "",
  street: "",
  suburb: "",
  province: "",
  postcode: "",
  summaryDescription: "",
  propertyStatusText: "",
  propertyStatusPillVariant: PropertyStatusPillVariant.VACANT,
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
  listingStatusPillVariant: ListingStatusPillVariant.DRAFT,
  shouldDisplayListingStatus: true,
  shouldDisplaySubmitDraftButton: true,
  isLoading: false, 
  propertyIdToLoad: null,
  loadedPropertyId: null, 
  error: null, // Added for error handling
};

export const propertyListingSlice = createSlice({
  name: "propertyListing",
  initialState: initialState,
  reducers: {
    prepareForLoad(state, action: PayloadAction<string>) {
      const newPropertyIdToLoad = action.payload;
      if (state.loadedPropertyId !== newPropertyIdToLoad) {
        state.streetNumber = initialState.streetNumber;
        state.street = initialState.street;
        state.suburb = initialState.suburb;
        state.province = initialState.province;
        state.postcode = initialState.postcode;
        state.summaryDescription = initialState.summaryDescription;
        state.propertyStatusText = initialState.propertyStatusText;
        state.propertyStatusPillVariant = initialState.propertyStatusPillVariant; // Or set to a specific default like DEFAULT if applicable
        state.propertyDescription = initialState.propertyDescription;
        state.propertyFeatures = initialState.propertyFeatures;
        state.propertyType = initialState.propertyType;
        state.propertyLandArea = initialState.propertyLandArea;
        state.propertyBathrooms = initialState.propertyBathrooms;
        state.propertyParkingSpaces = initialState.propertyParkingSpaces;
        state.propertyBedrooms = initialState.propertyBedrooms;
        state.propertyPrice = initialState.propertyPrice;
        state.inspectionBookingUiStateList = initialState.inspectionBookingUiStateList;
        state.listingImageUrls = initialState.listingImageUrls;
      }
      state.propertyIdToLoad = newPropertyIdToLoad;
      state.isLoading = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(load.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(load.fulfilled, (state, action) => {
      state.streetNumber = action.payload.streetnumber;
      state.street = action.payload.streetname;
      state.suburb = action.payload.suburb;
      state.province = action.payload.province;
      state.postcode = action.payload.postcode;
      state.summaryDescription = action.payload.summaryDescription;
      state.propertyStatusText = action.payload.propertyStatus;
      state.propertyStatusPillVariant = getPropertyStatusPillVariant(
        action.payload.propertyStatus
      );
      state.propertyDescription = action.payload.description;
      state.propertyFeatures = action.payload.features;
      state.propertyType = action.payload.type;
      state.propertyLandArea = action.payload.area
        ? getPropertyAreaDisplayString(action.payload.area)
        : "N/A";
      state.propertyBathrooms = action.payload.bathrooms.toString();
      state.propertyParkingSpaces = action.payload.parking.toString();
      state.propertyBedrooms = action.payload.bedrooms.toString();
      state.propertyPrice = getPropertyPriceDisplayString(
        action.payload.pricePerMonth
      );
      state.inspectionBookingUiStateList = action.payload.inspections.map(
        (inspection) => ({
          date: getFormattedDateStringFromDate(inspection.start_time),
          startingTime: getFormattedTimeStringFromDate(inspection.start_time),
          endingTime: getFormattedTimeStringFromDate(inspection.end_time),
        })
      );
      state.listingImageUrls = action.payload.image_urls;
      state.listingStatusText = getListingStatusDisplayString(
        action.payload.listing_status
      );
      state.listingStatusPillVariant = getListingStatusPillVariant(
        action.payload.listing_status
      );
      state.isLoading = false;
      state.propertyIdToLoad = null; // Reset after successful load
      state.loadedPropertyId = action.meta.arg; // Store the ID of the property that was just loaded
      state.error = null;
    });
    builder.addCase(load.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to load property details";
      state.propertyIdToLoad = null; // Reset on failure
      state.loadedPropertyId = null; // Clear loaded ID on failure
    });
  },
});

function getPropertyAreaDisplayString(area: number): string {
  return `${area}m²`;
}

function getPropertyPriceDisplayString(price: number): string {
  return `$${price.toString()}/month`;
}

function getListingStatusDisplayString(status: string): string {
  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case ListingStatus.DRAFT.toLowerCase():
      return "DRAFT LISTING";
    case ListingStatus.LISTED.toLowerCase():
      return "LISTED";
    case ListingStatus.TENANT_SELECTION.toLowerCase():
      return "TENANT SELECTION";
    case ListingStatus.TENANT_APPROVAL.toLowerCase():
      return "TENANT APPROVAL";
    default:
      return status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Unknown Status";
  }
}

function getPropertyStatusPillVariant(
  status: string
): PropertyStatusPillVariant {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === "vacant") {
    return PropertyStatusPillVariant.VACANT;
  }
  return (PropertyStatusPillVariant as any).DEFAULT || PropertyStatusPillVariant.VACANT; // Fallback 
}

function getListingStatusPillVariant(status: string): ListingStatusPillVariant {
  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case ListingStatus.DRAFT.toLowerCase():
      return ListingStatusPillVariant.DRAFT;
    case ListingStatus.LISTED.toLowerCase():
    case ListingStatus.TENANT_SELECTION.toLowerCase():
    case ListingStatus.TENANT_APPROVAL.toLowerCase():
      return ListingStatusPillVariant.CURRENT;
    default:
      return ListingStatusPillVariant.DRAFT;
  }
}

export const load = createAsyncThunk(
  "propertyListing/load",
  async (propertyId: string) => {
    const propertyWithListingData = await getPropertyWithListingDataUseCase(
      propertyId
    );
    return propertyWithListingData;
  }
);

export const selectPropertyListingUiState = (state: RootState) =>
  state.propertyListing;

export const { prepareForLoad } = propertyListingSlice.actions;
