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
import { PropertyWithListingData } from "/app/client/library-modules/use-cases/property-listing/models/PropertyWithListingData";

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
    _id: string;
    date: string;
    startingTime: string;
    endingTime: string;
    tenant_ids: string[];
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
  isLoading: boolean;
  propertiesWithListingData: PropertyWithListingData[];
  error: string | null;
  hasProperty: boolean;
  fetchError: string | null;
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
  isLoading: false,
  propertiesWithListingData: [],
  error: null,
  hasProperty: false,
  fetchError: null
};

export const submitDraftListingAsync = createAsyncThunk(
  "propertyListing/submitDraftListing",
  async (propertyId: string) => {
    const submitDraftListing = await submitDraftListingUseCase(propertyId);
    return submitDraftListing;
  }
);

export const fetchTenantPropertyWithListingData = createAsyncThunk(
  "tenantProperties/fetchTenantProperties",
  async (_: void, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = state.currentUser.authUser?.userId;
      if (!userId) {
        return rejectWithValue("No authenticated user");
      }

      const tenant = await getTenantById(userId);
      const property = await getPropertyByTenantId(tenant.tenantId);
      const listings = await getPropertyWithListingDataUseCase(property.propertyId)
  
      return listings.image_urls;
    } catch {
      return rejectWithValue("Failed to fetch agent properties");
    }
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
          _id: inspection._id,
          date: getFormattedDateStringFromDate(new Date(inspection.start_time)),
          startingTime: getFormattedTimeStringFromDate(new Date(inspection.start_time)),
          endingTime: getFormattedTimeStringFromDate(new Date(inspection.end_time)),
          tenant_ids: inspection.tenant_ids
        })
      );
      state.listingImageUrls = action.payload.image_urls;

      state.shouldShowLoadingState = false;
      state.landlords = action.payload.landlords;
      state.hasProperty = true;
      state.fetchError = null;
      })

    builder.addCase(fetchTenantProperty.pending, (state) => {
      state.shouldShowLoadingState = true;
      state.fetchError = null;
    });
    builder.addCase(fetchTenantProperty.fulfilled, (state, action) => {
      if (action.payload.property) {
        state.hasProperty = true;
        state.currentPropertyId = action.payload.property.propertyId;
      } else {
        state.hasProperty = false;
        state.shouldShowLoadingState = false;
      }
    });
    builder.addCase(fetchTenantProperty.rejected, (state, action) => {
      state.shouldShowLoadingState = false;
      state.hasProperty = false;
      state.fetchError = action.error.message || 'Failed to fetch tenant property';
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

    builder
      .addCase(fetchTenantPropertyWithListingData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTenantPropertyWithListingData.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.listingImageUrls = action.payload;
        }
      )
      .addCase(
        fetchTenantPropertyWithListingData.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            (action.payload as string) || "Failed to fetch agent properties";
        }
      );
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
    const result = await getPropertyWithListingDataUseCase(
      propertyId
    );
    const landlords: Landlord[] = await getAllLandlords();
    
    // Serialize Date objects in propertyListingInspections to avoid Redux serialization warnings
    const serializedData = {
      ...result,
      propertyListingInspections: result.propertyListingInspections.map(inspection => ({
        ...inspection,
        start_time: inspection.start_time instanceof Date ? inspection.start_time.toISOString() : inspection.start_time,
        end_time: inspection.end_time instanceof Date ? inspection.end_time.toISOString() : inspection.end_time,
      })),
    };
    
    return { ...serializedData, landlords };
  }
);


export const selectTenantPropertyUiState = (state: RootState) =>
  state.tenantProperty;