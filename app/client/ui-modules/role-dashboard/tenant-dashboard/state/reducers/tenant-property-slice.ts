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
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { getAllLandlords } from "/app/client/library-modules/domain-models/user/role-repositories/landlord-repository";
import { Agent } from '/app/client/library-modules/domain-models/user/Agent';
import { ProfileData } from '/app/client/library-modules/domain-models/user/ProfileData';
import { getAgentByAgentId, getAgentById } from '/app/client/library-modules/domain-models/user/role-repositories/agent-repository';
import { getProfileDataById } from '/app/client/library-modules/domain-models/user/role-repositories/profile-data-repository';
import { getPropertyById, getPropertyByTenantId } from '/app/client/library-modules/domain-models/property/repositories/property-repository';
import { getTenantById } from "/app/client/library-modules/domain-models/user/role-repositories/tenant-repository";

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
      state.inspectionBookingUiStateList = action.payload.propertyListingInspections.map(
        (inspection) => ({
          date: getFormattedDateStringFromDate(inspection.start_time),
          startingTime: getFormattedTimeStringFromDate(inspection.start_time),
          endingTime: getFormattedTimeStringFromDate(inspection.end_time),
        })
      );
      state.listingImageUrls = action.payload.image_urls;

      state.shouldShowLoadingState = false;
      state.landlords = action.payload.landlords;
      })

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
export const fetchTenantProperty = createAsyncThunk(
  "tenantProperty/fetchTenantProperty",
  async (userId: string) => {
      // First, get the tenant data which includes task IDs
      let property = null;
      
      try {
        const tenantResponse = await getTenantById(userId);
        console.log(tenantResponse) 
        
        // Fetch tasks (if any)

        
        // Try to fetch property - this might fail if no property is assigned
        try {
          property = await getPropertyByTenantId(tenantResponse.tenantId);
          console.log(property)
          console.log(property.propertyId)
        } catch (propertyError) {
          console.log("No property found for tenant:", tenantResponse.tenantId);
          // Property remains null - this is expected for tenants without assigned properties
        }
      }
      catch (error) {
        console.error("Error fetching tenant details:", error);
        throw new Error("Failed to fetch tenant details");
      }
      console.log(property?.propertyId)
      return {
        property: property,
      };
    }
);

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