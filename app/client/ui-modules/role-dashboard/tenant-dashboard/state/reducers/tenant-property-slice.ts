import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ListingStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingStatusPill";
import { PropertyStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingSummary";
import { getPropertyWithListingDataUseCase } from "/app/client/library-modules/use-cases/property-listing/GetPropertyWithListingDataUseCase";
import { submitDraftListingUseCase } from "/app/client/library-modules/use-cases/property-listing/SubmitDraftListingUseCase";
import {
  getFormattedDateStringFromDate,
  getFormattedTimeStringFromDate,
} from "/app/client/library-modules/utils/date-utils";
import { RootState } from "/app/client/store";
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { getAllLandlords } from "/app/client/library-modules/domain-models/user/role-repositories/landlord-repository";
import { Agent } from '/app/client/library-modules/domain-models/user/Agent';
import { ProfileData } from '/app/client/library-modules/domain-models/user/ProfileData';
import { getAgentByAgentId, getAgentById } from '/app/client/library-modules/domain-models/user/role-repositories/agent-repository';
import { getProfileDataById } from '/app/client/library-modules/domain-models/user/role-repositories/profile-data-repository';
import { getPropertyById } from '/app/client/library-modules/domain-models/property/repositories/property-repository';

interface TenantPropertyState {
  propertyId: string;
  propertyAgentId: string;
  propertyLandlordId: string;
  streetNumber: string;
  street: string;
  suburb: string;
  province: string;
  postcode: string;
  summaryDescription: string;
  areaValue: number;
  propertyStatusText: string;
  propertyStatusPillVariant: PropertyStatusPillVariant;
  propertyDescription: string;
  propertyFeatures: string[];
  propertyType: string;
  propertyLandArea: string;
  propertyBathrooms: string;
  propertyParkingSpaces: string;
  propertyBedrooms: string;
  propertyPrice: string;
  mapUiState: {
    markerLatitude: number;
    markerLongitude: number;
  };
  inspectionBookingUiStateList: {
    date: string;
    startingTime: string;
    endingTime: string;
  }[];
  listingImageUrls: string[];
  listingStatusText: string;
  listingStatusPillVariant: ListingStatusPillVariant;
  shouldDisplayListingStatus: boolean;
  shouldDisplaySubmitDraftButton: boolean;
  shouldDisplayReviewTenantButton: boolean;
  shouldDisplayEditListingButton: boolean;
  shouldShowLoadingState: boolean;
  landlords: Landlord[];
  isSubmittingDraft: boolean;
  currentPropertyId: string | undefined;
  agent: Agent | null;
  agentProfile: ProfileData | null;
  isLoadingAgent: boolean;
  agentError: string | null;
}

const initialState: TenantPropertyState = {
  propertyId: "",
  propertyAgentId: "",
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
  mapUiState: {
    markerLatitude: 0,
    markerLongitude: 0,
  },
  inspectionBookingUiStateList: [],
  listingImageUrls: [],
  listingStatusText: "",
  listingStatusPillVariant: ListingStatusPillVariant.DRAFT,
  shouldDisplayListingStatus: true,
  shouldDisplaySubmitDraftButton: true,
  shouldDisplayReviewTenantButton: false,
  shouldDisplayEditListingButton: true,
  shouldShowLoadingState: true,
  landlords: [],
  isSubmittingDraft: false,
  currentPropertyId: undefined,
  agent: null,
  agentProfile: null,
  isLoadingAgent: false,
  agentError: null,
};

export const submitDraftListingAsync = createAsyncThunk(
  "propertyListing/submitDraftListing",
  async (propertyId: string) => {
    const submitDraftListing = await submitDraftListingUseCase(propertyId);
    return submitDraftListing;
  }
);

export const fetchAgentWithProfile = createAsyncThunk(
  "tenantProperty/fetchAgentWithProfile",
  async (propertyId: string) => {
    try {
      // Debug log for property ID
      console.log('Fetching property with ID:', propertyId);
      
      const property = await getPropertyById(propertyId);
      console.log('Found property:', property);

      if (!property.agentId) {
        throw new Error('No agent assigned to this property');
      }
      // console.log('Property agent ID:', property.agentId);
      // const user = await getUserAccountById(property.agentId);
      // console.log('Found user account for agent:', user);

      // Debug log for agent ID
      console.log('Fetching agent with ID:', property.agentId);
      
      const agent = await getAgentByAgentId(property.agentId);
      console.log('Found agent:', agent);

      const profileData = await getProfileDataById(agent.profileDataId);
      console.log('Found profile data:', profileData);

      return {
        agent,
        profile: profileData
      };
    } catch (error) {
      console.error('Error in fetchAgentWithProfile:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch agent details: ${error.message}`);
      }
      throw error;
    }
  }
);

export const tenantPropertySlice = createSlice({
  name: "tenantProperty",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(load.pending, (state) => {
      state.shouldShowLoadingState = true;
    });
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
      state.mapUiState = {
        markerLatitude: action.payload.locationLatitude,
        markerLongitude: action.payload.locationLongitude,
      }
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
      state.shouldDisplayEditListingButton = isDraft;

      state.shouldShowLoadingState = false;
      state.landlords = action.payload.landlords;
      })



    builder.addCase(submitDraftListingAsync.pending, (state, action) => {
      state.isSubmittingDraft = true;
      state.currentPropertyId = action.meta.arg;
    });

    builder.addCase(submitDraftListingAsync.fulfilled, (state, action) => {
      console.log('Draft listing submitted successfully:', action.payload);
      state.listingStatusText = getListingStatusDisplayString("listed");
      state.listingStatusPillVariant = getListingStatusPillVariant("listed");
      state.shouldDisplaySubmitDraftButton = false;
      state.shouldDisplayReviewTenantButton = true;
      state.shouldDisplayEditListingButton = false;
      state.isSubmittingDraft = false;
      state.currentPropertyId = action.meta.arg;
    });

    builder.addCase(submitDraftListingAsync.rejected, (state, action) => {
      console.error('Failed to submit draft listing:', action.error.message);
      state.isSubmittingDraft = false;
      alert(`Failed to update listing: ${action.error.message}`);
      state.currentPropertyId = action.meta.arg;
    });

    builder
      .addCase(fetchAgentWithProfile.pending, (state) => {
        state.isLoadingAgent = true;
        state.agentError = null;
      })
      .addCase(fetchAgentWithProfile.fulfilled, (state, action) => {
        state.isLoadingAgent = false;
        state.agent = action.payload.agent;
        state.agentProfile = action.payload.profile;
        state.agentError = null;
      })
      .addCase(fetchAgentWithProfile.rejected, (state, action) => {
        state.isLoadingAgent = false;
        state.agentError = action.error.message || 'Failed to fetch agent details';
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
    case "listed":
      return "CURRENT LISTING";
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
  return PropertyStatusPillVariant.VACANT;
}

function getListingStatusPillVariant(status: string): ListingStatusPillVariant {
  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case ListingStatus.DRAFT.toLowerCase():
      return ListingStatusPillVariant.DRAFT;
    case "listed":
    case ListingStatus.LISTED.toLowerCase():
    case ListingStatus.TENANT_SELECTION.toLowerCase():
    case ListingStatus.TENANT_APPROVAL.toLowerCase():
      return ListingStatusPillVariant.CURRENT;
    default:
      return ListingStatusPillVariant.DRAFT;
  }
}

export const fetchPropertyAgent = createAsyncThunk(
  "propertyListing/fetchPropertyAgent",
  async (propertyAgentId: string, { rejectWithValue }) => {
    try {
      // propertyAgentId = (await getPropertyById(propertyId)).agentId;
      return await getAgentById(propertyAgentId);
    } catch (err) {
      return rejectWithValue("Failed to fetch property agent");
    }
  }
)

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


export const selectTenantPropertyUiState = (state: RootState) =>
  state.tenantProperty;