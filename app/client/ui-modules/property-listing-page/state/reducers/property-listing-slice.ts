import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ListingStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingStatusPill";
import { PropertyStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingSummary";
import { PropertyListingPageUiState } from "/app/client/ui-modules/property-listing-page/state/PropertyListingUiState";
import { submitDraftListingUseCase } from "/app/client/library-modules/use-cases/property-listing/SubmitDraftListingUseCase";
import { LoadPropertyWithTenantApplicationsUseCase } from "/app/client/library-modules/use-cases/property-listing/LoadPropertyWithTenantApplicationsUseCase";
import { RootState } from "/app/client/store";
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";
import { loadTenantApplicationsForPropertyAsync } from "../../../tenant-selection/state/reducers/tenant-selection-slice";
import {
  getFormattedDateStringFromDate,
  getFormattedTimeStringFromDate,
} from "/app/client/library-modules/utils/date-utils";

import { PropertyListingInspectionDocument } from "/app/server/database/property-listing/models/PropertyListingInspectionDocument";
import { AddTenantToInspectionUseCase } from "/app/client/library-modules/use-cases/property-listing/AddTenantToInspectionUseCase";
import { ListingRepository } from "/app/client/library-modules/domain-models/property-listing/repositories/listing-repository";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { apiPropertyInsertPrice } from "/app/client/library-modules/apis/property-price/price-api";
import { addTenantToInspectionApi } from "/app/client/library-modules/apis/property-listing/listing-api";
import { deleteDraftListingUseCase } from "/app/client/library-modules/use-cases/property-listing/DeleteDraftListingUseCase";

const initialState: PropertyListingPageUiState = {
  agentId: "",
  propertyId: "",
  propertyLandlordId: "",
  streetNumber: "",
  street: "",
  suburb: "",
  province: "",
  postcode: "",
  apartmentNumber: "",
  summaryDescription: "",
  areaValue: 0,
  propertyStatusText: "",
  propertyStatusPillVariant: PropertyStatusPillVariant.VACANT,
  propertyDescription: "",
  propertyFeatures: [],
  propertyFeatureIds: [],
  propertyType: "",
  propertyLandArea: "",
  propertyBathrooms: "",
  propertyParkingSpaces: "",
  propertyBedrooms: "",
  propertyPrice: "",
  monthlyRent: 0,
  mapUiState: {
    markerLatitude: 0,
    markerLongitude: 0,
  },
  inspectionBookingUiStateList: [],
  inspectionTimes: [],
  bookedPropertyListingInspections: [],
  listingImageUrls: [],
  listingStatusText: "",
  listingStatusPillVariant: ListingStatusPillVariant.DRAFT,
  leaseTerm: "12_months",
  shouldDisplayListingStatus: true,
  shouldDisplaySubmitDraftButton: true,
  shouldDisplayReviewTenantButton: false,
  shouldDisplayEditListingButton: true,
  shouldShowLoadingState: true,
  landlords: [],
  isSubmittingDraft: false,
  currentPropertyId: undefined,
};

export const submitDraftListingAsync = createAsyncThunk(
  "propertyListing/submitDraftListing",
  async (propertyId: string) => {
    const submitDraftListing = await submitDraftListingUseCase(propertyId);
    return submitDraftListing;
  }
);

export const deleteDraftListingAsync = createAsyncThunk(
  "propertyListing/deleteDraftListing",
  async (propertyId: string) => {
    const deleteDraftListing = await deleteDraftListingUseCase(propertyId);
    return deleteDraftListing;
  }
);


export const insertPropertyPriceAsync = createAsyncThunk(
  "propertyListing/insertPropertyPrice",
  async ({ propertyId, price }: { propertyId: string; price: number }) => {
    const insertedPriceId = await apiPropertyInsertPrice(propertyId, price);
    return { propertyId, price, insertedPriceId };
  }
);

export const propertyListingSlice = createSlice({
  name: "propertyListing",
  initialState: initialState,
  reducers: {
    addBookedPropertyListingInspection: (state, action) => {
      const index = action.payload;
      if (!state.bookedPropertyListingInspections.includes(index)) {
        state.bookedPropertyListingInspections.push(index);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(load.pending, (state) => {
      state.shouldShowLoadingState = true;
    });
    builder.addCase(load.fulfilled, (state, action) => {
      state.propertyId = action.payload.propertyId;
      state.propertyLandlordId = action.payload.landlordId;
      state.agentId = action.payload.agentId;
      state.propertyId = action.payload.propertyId;
      state.streetNumber = action.payload.streetnumber;
      state.street = action.payload.streetname;
      state.suburb = action.payload.suburb;
      state.province = action.payload.province;
      state.postcode = action.payload.postcode;
      state.apartmentNumber = action.payload.apartment_number || "";
      state.summaryDescription = action.payload.summaryDescription;
      state.areaValue = action.payload.area ?? 0;
      state.propertyStatusText = action.payload.propertyStatus;
      state.propertyStatusPillVariant = getPropertyStatusPillVariant(
        action.payload.propertyStatus
      );
      state.propertyDescription = action.payload.description;
      state.propertyFeatures = action.payload.features;
      state.propertyFeatureIds = action.payload.featureIds;
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
      state.monthlyRent = action.payload.pricePerMonth;
      state.mapUiState = {
        markerLatitude: action.payload.locationLatitude,
        markerLongitude: action.payload.locationLongitude,
      };

      state.inspectionBookingUiStateList =
        action.payload.propertyListingInspections.map((inspection) => {
          console.log("Inspection from backend:", inspection);
          return {
            _id: inspection._id,
            date: getFormattedDateStringFromDate(new Date(inspection.start_time)),
            startingTime: getFormattedTimeStringFromDate(new Date(inspection.start_time)),
            endingTime: getFormattedTimeStringFromDate(new Date(inspection.end_time)),
            tenant_ids: inspection.tenant_ids || [],
          };
        });

      state.inspectionTimes = action.payload.propertyListingInspections.map(
        (inspection) => ({
          start_time: inspection.start_time,
          end_time: inspection.end_time,
        })
      );

      state.listingImageUrls = action.payload.image_urls;
      state.listingStatusText = getListingStatusDisplayString(
        action.payload.listing_status
      );
      state.listingStatusPillVariant = getListingStatusPillVariant(
        action.payload.listing_status
      );
      state.leaseTerm = action.payload.lease_term;

      // Set button visibility based on listing status
      const isDraft = action.payload.listing_status.toLowerCase() === "draft";
      state.shouldDisplaySubmitDraftButton = isDraft;
      state.shouldDisplayReviewTenantButton = !isDraft;
      state.shouldDisplayEditListingButton = isDraft;

      state.shouldShowLoadingState = false;
      state.landlords = action.payload.landlords;
    });

    builder.addCase(submitDraftListingAsync.pending, (state, action) => {
      state.isSubmittingDraft = true;
      state.currentPropertyId = action.meta.arg;
    });

    builder.addCase(submitDraftListingAsync.fulfilled, (state, action) => {
      console.log("Draft listing submitted successfully:", action.payload);
      state.listingStatusText = getListingStatusDisplayString("listed");
      state.listingStatusPillVariant = getListingStatusPillVariant("listed");
      state.shouldDisplaySubmitDraftButton = false;
      state.shouldDisplayReviewTenantButton = true;
      state.shouldDisplayEditListingButton = false;
      state.isSubmittingDraft = false;
      state.currentPropertyId = action.meta.arg;
    });

    builder.addCase(submitDraftListingAsync.rejected, (state, action) => {
      console.error("Failed to submit draft listing:", action.error.message);
      state.isSubmittingDraft = false;
      alert(`Failed to update listing: ${action.error.message}`);
      state.currentPropertyId = action.meta.arg;
    });

    builder.addCase(bookPropertyInspectionAsync.fulfilled, (state, action) => {
      const updatedInspection = action.payload;
      const index = state.inspectionBookingUiStateList.findIndex(
        (i) => i._id === updatedInspection._id
      );
      if (index !== -1) {
        state.inspectionBookingUiStateList[index] = {
          ...state.inspectionBookingUiStateList[index],
          tenant_ids: updatedInspection.tenant_ids,
        };
      }
    });

    builder.addCase(insertPropertyPriceAsync.fulfilled, (state, action) => {
      const { price } = action.payload;
      // Update the property price in the state
      state.propertyPrice = getPropertyPriceDisplayString(price);
      state.monthlyRent = price;
    });

    builder.addCase(insertPropertyPriceAsync.rejected, (state, action) => {
      console.error("Failed to update property price:", action.error.message);
      alert(`Failed to update property price: ${action.error.message}`);
    });
  },
});

export const { addBookedPropertyListingInspection } =
  propertyListingSlice.actions;

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
    case "listed":
      return "CURRENT LISTING";
    case ListingStatus.LISTED.toLowerCase():
      return "LISTED";
    case ListingStatus.TENANT_APPROVAL.toLowerCase():
      return "TENANT APPROVAL";
    default:
      return status
        ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        : "Unknown Status";
  }
}

function getPropertyStatusPillVariant(
  status: string
): PropertyStatusPillVariant {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === "vacant") {
    return PropertyStatusPillVariant.VACANT;
  }
  return PropertyStatusPillVariant.VACANT;
}

function getListingStatusPillVariant(status: string): ListingStatusPillVariant {
  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case ListingStatus.DRAFT.toLowerCase():
      return ListingStatusPillVariant.DRAFT;
    case "listed":
    case ListingStatus.LISTED.toLowerCase():
    case ListingStatus.TENANT_APPROVAL.toLowerCase():
      return ListingStatusPillVariant.CURRENT;
    default:
      return ListingStatusPillVariant.DRAFT;
  }
}

export const load = createAsyncThunk(
  "propertyListing/load",
  async (propertyId: string, { dispatch }) => {
    const useCase = new LoadPropertyWithTenantApplicationsUseCase();
    const result = await useCase.execute(propertyId);

    if (result.shouldLoadTenantApplications) {
      dispatch(loadTenantApplicationsForPropertyAsync(propertyId));
    }

    // Serialize Date objects in propertyListingInspections to avoid Redux serialization warnings
    const serializedData = {
      ...result.propertyWithListingData,
      propertyListingInspections: result.propertyWithListingData.propertyListingInspections.map(inspection => ({
        ...inspection,
        start_time: inspection.start_time instanceof Date ? inspection.start_time.toISOString() : inspection.start_time,
        end_time: inspection.end_time instanceof Date ? inspection.end_time.toISOString() : inspection.end_time,
      })),
      landlords: result.landlords
    };

    return serializedData;
  }
);


export const bookPropertyInspectionAsync = createAsyncThunk(
  "propertyListing/bookPropertyInspection",
  async ({
    inspectionId,
    tenantId,
    propertyId,
  }: {
    inspectionId: string;
    tenantId: string;
    propertyId: string;
  }): Promise<PropertyListingInspectionDocument> => {
    console.log("got to the bookPropertyInspectionAsync");
    console.log("inspectionId:", inspectionId, "tenantId:", tenantId);
    const updatedInspection: PropertyListingInspectionDocument = await addTenantToInspectionApi(
      inspectionId,
      tenantId
    );
    return updatedInspection;
  }
);
export const selectPropertyListingUiState = (state: RootState) =>
  state.propertyListing;
