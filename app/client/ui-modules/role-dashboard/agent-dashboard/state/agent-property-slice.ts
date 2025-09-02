import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { getAgentById } from "/app/client/library-modules/domain-models/user/role-repositories/agent-repository";
import { getPropertyByAgentId } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { getPropertyWithListingDataUseCase } from "/app/client/library-modules/use-cases/property-listing/GetPropertyWithListingDataUseCase";
import { PropertyWithListingData } from "/app/client/library-modules/use-cases/property-listing/models/PropertyWithListingData";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";

interface AgentPropertyState {
  isLoading: boolean;
  propertiesWithListingData: PropertyWithListingData[];
  error: string | null;
  search: string;
  statusFilter: PropertyStatus | ListingStatus | "ALL";
}

const initialState: AgentPropertyState = {
  isLoading: false,
  propertiesWithListingData: [],
  error: null,
  search: "",
  statusFilter: "ALL",
};

export const fetchAgentPropertiesWithListingData = createAsyncThunk(
  "agentProperties/fetchAgentProperties",
  async (_: void, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = state.currentUser.authUser?.userId;
      if (!userId) {
        return rejectWithValue("No authenticated user");
      }

      const agent = await getAgentById(userId);
      const properties = await getPropertyByAgentId(agent.agentId);
      const listings = await Promise.all(
        properties.map((property) =>
          getPropertyWithListingDataUseCase(property.propertyId)
        )
      );
      return listings;
    } catch {
      return rejectWithValue("Failed to fetch agent properties");
    }
  }
);

export const agentPropertySlice = createSlice({
  name: "agentProperties",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgentPropertiesWithListingData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAgentPropertiesWithListingData.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.propertiesWithListingData = action.payload;
        }
      )
      .addCase(
        fetchAgentPropertiesWithListingData.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            (action.payload as string) || "Failed to fetch agent properties";
        }
      );
  },
});

// Selectors
export const selectAgentPropertiesWithListingDataState = (state: RootState) =>
  state.agentProperties;
export const selectAgentPropertySearch = (state: RootState) =>
  state.agentProperties.search;
export const selectAgentPropertyStatusFilter = (state: RootState) =>
  state.agentProperties.statusFilter;

export const { setSearch, setStatusFilter } = agentPropertySlice.actions;
export default agentPropertySlice.reducer;
