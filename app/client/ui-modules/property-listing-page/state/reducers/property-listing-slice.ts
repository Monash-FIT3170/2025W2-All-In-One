import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Meteor } from "meteor/meteor";
import { ListingStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingStatusPill";
import { PropertyStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingSummary";
import { PropertyListingPageUiState } from "/app/client/ui-modules/property-listing-page/state/PropertyListingUiState";
import { getPropertyWithListingDataUseCase } from "/app/client/library-modules/use-cases/property-listing/GetPropertyWithListingDataUseCase";
import {
  getFormattedDateStringFromDate,
  getFormattedTimeStringFromDate,
} from "/app/client/library-modules/utils/date-utils";
import { RootState } from "/app/client/store";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

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
  shouldDisplayReviewTenantButton: false,
  shouldShowLoadingState: true,
};

export const submitDraftListingAsync = createAsyncThunk(
  "propertyListing/submitDraftListing",
  async (propertyId: string) => {
    return new Promise((resolve, reject) => {
      Meteor.call(MeteorMethodIdentifier.LISTING_SUBMIT_DRAFT, propertyId, (error: any, result: any) => {
        if (error) {
          console.error('Meteor method error:', error);
          reject(new Error(error.reason || error.message || 'Failed to update listing'));
        } else {
          console.log('Meteor method success:', result);
          resolve(result);
        }
      });
    });
  }
);

export const propertyListingSlice = createSlice({
  name: "propertyListing",
  initialState: initialState,
  reducers: {
    submitDraftListing: (state) => {
      // Change listing status to current/listed
      state.listingStatusText = getListingStatusDisplayString("current");
      state.listingStatusPillVariant = getListingStatusPillVariant("current");
      // Hide submit draft button and show review tenant button
      state.shouldDisplaySubmitDraftButton = false;
      state.shouldDisplayReviewTenantButton = true;
    },
  },
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
      
      // Set button visibility based on listing status
      const isDraft = action.payload.listing_status.toLowerCase() === "draft";
      state.shouldDisplaySubmitDraftButton = isDraft;
      state.shouldDisplayReviewTenantButton = !isDraft;
      
      state.shouldShowLoadingState = false;
    });


    builder.addCase(submitDraftListingAsync.fulfilled, (state, action) => {
      console.log('Draft listing submitted successfully:', action.payload);
    });
    
    builder.addCase(submitDraftListingAsync.rejected, (state, action) => {
      console.error('Failed to submit draft listing:', action.error.message);
      // Revert UI changes on error
      state.listingStatusText = getListingStatusDisplayString("draft");
      state.listingStatusPillVariant = getListingStatusPillVariant("draft");
      state.shouldDisplaySubmitDraftButton = true;
      state.shouldDisplayReviewTenantButton = false;

      alert(`Failed to update listing: ${action.error.message}`);
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
    case "current":
      return "CURRENT LISTING";
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
      return PropertyStatusPillVariant.VACANT;
  }
}

function getListingStatusPillVariant(status: string): ListingStatusPillVariant {
  switch (status.toLowerCase()) {
    case "draft":
      return ListingStatusPillVariant.DRAFT;
    case "current":
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

// Export the actions
export const { submitDraftListing } = propertyListingSlice.actions;

export const selectPropertyListingUiState = (state: RootState) =>
  state.propertyListing;