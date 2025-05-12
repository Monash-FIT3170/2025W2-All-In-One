import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ListingStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingStatusPill";
import { PropertyStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingSummary";
import { PropertyListingPageUiState } from "/app/client/ui-modules/property-listing-page/state/PropertyListingUiState";
import { getPropertyWithListingDataUseCase } from "/app/client/library-modules/use-cases/property-listing/GetPropertyWithListingDataUseCase";
import {
  getFormattedDateStringFromDate,
  getFormattedTimeStringFromDate,
} from "/app/client/library-modules/utils/date-utils";
import { RootState } from "/app/client/store";

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
  listingStatusPillVariant: ListingStatusPillVariant.DRAFT, // Assuming DRAFT is a valid default
  shouldDisplayListingStatus: true,
  shouldDisplaySubmitDraftButton: true,
};

export const propertyListingSlice = createSlice({
  name: "propertyListing",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
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
  switch (status.toLowerCase()) {
    case "draft":
      return "DRAFT LISTING";
    default:
      return "Unknown Status";
  }
}

function getPropertyStatusPillVariant(
  status: string
): PropertyStatusPillVariant {
  switch (status.toLowerCase()) {
    case "vacant":
      return PropertyStatusPillVariant.VACANT;
    default:
      return PropertyStatusPillVariant.VACANT; // Default to VACANT if unknown
  }
}

function getListingStatusPillVariant(status: string): ListingStatusPillVariant {
  switch (status.toLowerCase()) {
    case "draft":
      return ListingStatusPillVariant.DRAFT;
    case "current":
      return ListingStatusPillVariant.CURRENT;
    default:
      return ListingStatusPillVariant.DRAFT; // Default to DRAFT if unknown
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
