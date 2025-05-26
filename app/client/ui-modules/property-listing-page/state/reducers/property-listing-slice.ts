import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ListingStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingStatusPill";
import { PropertyStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingSummary";
import { PropertyListingPageUiState } from "/app/client/ui-modules/property-listing-page/state/PropertyListingUiState";
import { getPropertyWithListingDataUseCase } from "/app/client/library-modules/use-cases/property-listing/GetPropertyWithListingDataUseCase";
import { submitDraftListingUseCase } from "/app/client/library-modules/use-cases/property-listing/SubmitDraftListingUseCase";
import {
  getFormattedDateStringFromDate,
  getFormattedTimeStringFromDate,
} from "/app/client/library-modules/utils/date-utils";
import { RootState } from "/app/client/store";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { getAllLandlords } from "/app/client/library-modules/domain-models/user/role-repositories/landlord-repository";

const initialState: PropertyListingPageUiState = {
  propertyId: "",
  propertyLandlordId: "",
  streetNumber: "",
  street: "",
  suburb: "",
  province: "",
  postcode: "",
  summaryDescription: "",
  areaValue: 0,
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
  landlords: [],
  isSubmittingDraft: false,
};

export const loadPropertyList = createAsyncThunk(
  "propertyListing/loadPropertyList",
  async (agentId: string) => {
    const properties = await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET_LIST, agentId) as ApiProperty[];
    return properties;
  }
);

export const submitDraftListingAsync = createAsyncThunk(
  "propertyListing/submitDraftListing",
  async (propertyId: string) => {
    const submitDraftListing = await submitDraftListingUseCase(propertyId);
    return submitDraftListing;
  }
);

export const propertyListingSlice = createSlice({
  name: "propertyListing",
  initialState: {
    ...initialState,
    propertyList: [] as ApiProperty[],
    propertyListLoading: false,
    propertyListError: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(load.fulfilled, (state, action) => {
      state.propertyId = action.payload.propertyId;
      state.propertyLandlordId = action.payload.landlordId;
        state.propertyId = action.payload.propertyId;
      state.streetNumber = action.payload.streetnumber;
        state.street = action.payload.streetname;
        state.suburb = action.payload.suburb;
        state.province = action.payload.province;
        state.postcode = action.payload.postcode;
        state.summaryDescription = action.payload.summaryDescription;
      state.areaValue = action.payload.area ?? 0;
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
      state.landlords = action.payload.landlords;
      })
      .addCase(loadPropertyList.pending, (state) => {
        state.propertyListLoading = true;
        state.propertyListError = null;
      })
      .addCase(loadPropertyList.fulfilled, (state, action) => {
        state.propertyList = action.payload;
        state.propertyListLoading = false;
      })
      .addCase(loadPropertyList.rejected, (state, action) => {
        state.propertyListLoading = false;
        state.propertyListError = action.error.message || "Failed to load properties";
      });


    builder.addCase(submitDraftListingAsync.pending, (state) => {
      state.isSubmittingDraft = true;
    });
    
    builder.addCase(submitDraftListingAsync.fulfilled, (state, action) => {
      console.log('Draft listing submitted successfully:', action.payload);
      state.listingStatusText = getListingStatusDisplayString("listed");
      state.listingStatusPillVariant = getListingStatusPillVariant("listed");
      state.shouldDisplaySubmitDraftButton = false;
      state.shouldDisplayReviewTenantButton = true;
      state.isSubmittingDraft = false;
    });
    
    builder.addCase(submitDraftListingAsync.rejected, (state, action) => {
      console.error('Failed to submit draft listing:', action.error.message);
      state.isSubmittingDraft = false;
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
    case "listed":
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
    case "listed":
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
    const landlords: Landlord[] = await getAllLandlords();
    return { ...propertyWithListingData, landlords };
  }
);


export const selectPropertyListingUiState = (state: RootState) =>
  state.propertyListing;

export const selectPropertyList = (state: RootState) => state.propertyListing.propertyList;
export const selectPropertyListLoading = (state: RootState) => state.propertyListing.propertyListLoading;
export const selectPropertyListError = (state: RootState) => state.propertyListing.propertyListError;
