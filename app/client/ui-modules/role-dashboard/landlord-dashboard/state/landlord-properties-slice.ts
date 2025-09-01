import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { getLandlordById } from "/app/client/library-modules/domain-models/user/role-repositories/landlord-repository";
import { getAllPropertiesByLandlordId } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { getPropertyWithListingDataUseCase } from "/app/client/library-modules/use-cases/property-listing/GetPropertyWithListingDataUseCase";
import { PropertyWithListingData } from "/app/client/library-modules/use-cases/property-listing/models/PropertyWithListingData";
import { getTenantById } from "/app/client/library-modules/domain-models/user/role-repositories/tenant-repository";
import { getAgentById } from "/app/client/library-modules/domain-models/user/role-repositories/agent-repository";
import { getProfileDataById } from "/app/client/library-modules/domain-models/user/role-repositories/profile-data-repository";

interface LandlordPropertiesState {
  isLoading: boolean;
  properties: any[]; // Properties with listing data and enhanced with tenant/agent names
  error: string | null;
}

const initialState: LandlordPropertiesState = {
  isLoading: false,
  properties: [],
  error: null,
};

export const fetchLandlordProperties = createAsyncThunk(
  "landlordProperties/fetchLandlordProperties",
  async (userId: string) => {
    try {
      const landlordResponse = await getLandlordById(userId);
      
      // Fetch basic properties first
      const properties = await getAllPropertiesByLandlordId(landlordResponse.landlordId);
      
      // Fetch properties with listing data using the use case
      const propertiesWithListingData = await Promise.all(
        properties.map(async (property) => {
          try {
            return await getPropertyWithListingDataUseCase(property.propertyId);
          } catch (error) {
            console.warn(`No listing found for property ${property.propertyId}`);
            // Return property with default listing values
            return {
              ...property,
              image_urls: [],
              locationLatitude: 0,
              locationLongitude: 0,
              listing_status: "DRAFT",
              inspections: []
            } as PropertyWithListingData;
          }
        })
      );
      
      // Fetch tenant and agent names for each property
      const propertiesWithNames = await Promise.all(
        propertiesWithListingData.map(async (property) => {
          let tenantName: string | undefined;
          let agentName: string | undefined;

          // Fetch tenant name if tenantId exists
          if (property.tenantId) {
            try {
              const tenant = await getTenantById(property.tenantId);
              const tenantProfile = await getProfileDataById(tenant.profileDataId);
              tenantName = `${tenantProfile.firstName} ${tenantProfile.lastName}`;
            } catch (error) {
              console.warn(`Failed to fetch tenant name for property ${property.propertyId}`);
            }
          }

          // Fetch agent name if agentId exists
          if (property.agentId) {
            try {
              const agent = await getAgentById(property.agentId);
              const agentProfile = await getProfileDataById(agent.profileDataId);
              agentName = `${agentProfile.firstName} ${agentProfile.lastName}`;
            } catch (error) {
              console.warn(`Failed to fetch agent name for property ${property.propertyId}`);
            }
          }

          return {
            ...property,
            tenantName,
            agentName,
          };
        })
      );
      
      return propertiesWithNames;
    } catch (error) {
      console.error("Error fetching landlord properties:", error);
      throw new Error("Failed to fetch landlord properties");
    }
  }
);

export const landlordPropertiesSlice = createSlice({
  name: "landlordProperties",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLandlordProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLandlordProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload;
      })
      .addCase(fetchLandlordProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch landlord properties";
      });
  },
});

// No manual reducers needed - state is managed through async thunks

// Selectors
export const selectLandlordProperties = (state: RootState) =>
  state.landlordProperties.properties;
export const selectLandlordPropertiesLoading = (state: RootState) =>
  state.landlordProperties.isLoading;
export const selectLandlordPropertiesError = (state: RootState) =>
  state.landlordProperties.error;

export default landlordPropertiesSlice.reducer;