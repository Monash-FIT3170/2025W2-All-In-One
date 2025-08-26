import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { TenantApplication } from "../../types/TenantApplication";
import { TenantApplicationStatus } from "../../../../../shared/api-models/tenant-application/TenantApplicationStatus";
import { FilterType } from "../../enums/FilterType";
import { TenantSelectionUiState } from "../TenantSelectionUiState";
import { LoadTenantApplicationsUseCase } from "/app/client/library-modules/use-cases/tenant-application/LoadTenantApplicationsUseCase";
import {
  acceptTenantApplicationUseCase,
  rejectTenantApplicationUseCase,
  sendAcceptedApplicationsToLandlordUseCase
} from "../../../../library-modules/use-cases/tenant-application/ProcessTenantApplicationUseCase";
import { createTenantApplicationUseCase } from "/app/client/library-modules/use-cases/tenant-application/CreateTenantApplicationUseCase";
import { Role } from "/app/shared/user-role-identifier";
const initialState: TenantSelectionUiState = {
  applicationsByProperty: {},
  activeFilter: FilterType.ALL,
  isLoading: false,
  error: null,
  currentStep: 1,
  bookedInspections: new Set<number>(),
};
// Creating tenant applications
// export const createTenantApplicationAsync = createAsyncThunk(
//   "tenantSelection/createTenantApplication",
//   async (_, { getState }) => {
//     const state = getState() as RootState;
//     const { propertyId, propertyLandlordId} = state.propertyListing;
//     const { currentUser, profileData } = state.currentUser;

//     return await createTenantApplication({
//       propertyId,
//       propertyLandlordId,
//       currentUser,
//       profileData
//     });
//   }
// );
export const createTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/createTenantApplication",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { propertyId, propertyLandlordId} = state.propertyListing;
    const { currentUser, profileData, authUser } = state.currentUser;
    const { bookedInspections } = state.tenantSelection;

    const result = await createTenantApplicationUseCase({
      propertyId,
      propertyLandlordId,
      currentUser,
      profileData,
      authUser,
      bookedInspections
    });

    if (!result.success) {
      throw new Error(result.message);
    }

    return {
      applicationId: result.applicationId!,
      applicantName: result.applicantName!,
      propertyId: result.propertyId!,
      status: result.status!,
      success: true,
      message: result.message,
    };
  }
);

export const rejectTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/rejectTenantApplication",
  async (applicationId: string) => {
    return await rejectTenantApplicationUseCase(applicationId);
  }
);

export const acceptTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/acceptTenantApplication",
  async (applicationId: string) => {
    return await acceptTenantApplicationUseCase(applicationId);
  }
);


export const sendAcceptedApplicationsToLandlordAsync = createAsyncThunk(
  "tenantSelection/sendAcceptedApplicationsToLandlord",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { propertyId, propertyLandlordId, streetNumber, street, suburb, province, postcode } = state.propertyListing;
    const { applicationsByProperty } = state.tenantSelection;

    // Get tenant applications for the specific property
    const propertyApplications = applicationsByProperty[propertyId] || [];

    // Check if there are any accepted applications
    const acceptedApplications = propertyApplications.filter((app: TenantApplication) =>
      app.status === TenantApplicationStatus.ACCEPTED
    );

    return await sendAcceptedApplicationsToLandlordUseCase(
      propertyId,
      propertyLandlordId,
      streetNumber,
      street,
      suburb,
      province,
      postcode,
      acceptedApplications
    );
  }
);
export const loadTenantApplicationsForPropertyAsync = createAsyncThunk(
  "tenantSelection/loadTenantApplicationsForProperty",
  async (propertyId: string) => {
    const useCase = new LoadTenantApplicationsUseCase();
    return await useCase.execute(propertyId);
  }
);

const updateApplicationStatus = (
  state: TenantSelectionUiState,
  applicationId: string,
  newStatus: TenantApplicationStatus
): void => {
  for (const [propertyId, applications] of Object.entries(state.applicationsByProperty)) {
    const applicationIndex = applications.findIndex(app => app.id === applicationId);
    if (applicationIndex !== -1) {
      state.applicationsByProperty[propertyId][applicationIndex] = {
        ...applications[applicationIndex],
        status: newStatus
      };
      break;
    }
  }
};

export const tenantSelectionSlice = createSlice({
  name: "tenantSelection",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    // temp fix until inspection slice file is created
    setBookedInspections: (state, action) => {
      state.bookedInspections = action.payload;
    },
    addBookedInspection: (state, action) => {
      state.bookedInspections.add(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Create tenant application
      .addCase(createTenantApplicationAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTenantApplicationAsync.fulfilled, (state, action) => {
        const propertyId = action.payload.propertyId;
        state.isLoading = false;

        const newApplication: TenantApplication = {
          id: action.payload.applicationId,
          name: action.payload.applicantName,
          status: action.payload.status,
        };

        if (!state.applicationsByProperty[propertyId]) {
          state.applicationsByProperty[propertyId] = [];
        }
        state.applicationsByProperty[propertyId].push(newApplication);
      })
      .addCase(createTenantApplicationAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create application";
      })

      // Reject tenant application
      .addCase(rejectTenantApplicationAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectTenantApplicationAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        updateApplicationStatus(state, action.payload.applicationId, TenantApplicationStatus.REJECTED);
      })
      .addCase(rejectTenantApplicationAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to reject application";
      })

      // Accept tenant application
      .addCase(acceptTenantApplicationAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptTenantApplicationAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        updateApplicationStatus(state, action.payload.applicationId, TenantApplicationStatus.ACCEPTED);
      })
      .addCase(acceptTenantApplicationAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to accept application";
      })

      // Load tenant applications for property
      .addCase(loadTenantApplicationsForPropertyAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadTenantApplicationsForPropertyAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const { propertyId, applications } = action.payload;

        if (!state.applicationsByProperty[propertyId]) {
          state.applicationsByProperty[propertyId] = [];
        }
        state.applicationsByProperty[propertyId] = applications;
      })
      .addCase(loadTenantApplicationsForPropertyAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load tenant applications";
      });
  },
});

export const {
  setFilter,
  clearError,
  setCurrentStep,
  setBookedInspections,
  addBookedInspection,
} = tenantSelectionSlice.actions;

export const selectTenantSelectionState = (state: RootState) => state.tenantSelection;
export const selectApplicationsByProperty = (state: RootState) => state.tenantSelection.applicationsByProperty;
export const selectActiveFilter = (state: RootState) => state.tenantSelection.activeFilter;
export const selectIsLoading = (state: RootState) => state.tenantSelection.isLoading;
export const selectError = (state: RootState) => state.tenantSelection.error;


export const selectApplicationsForProperty = (state: RootState, propertyId: string) => {
  return state.tenantSelection.applicationsByProperty[propertyId] || [];
};

export const selectHasAcceptedApplicationsForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.some((app: TenantApplication) => app.status === TenantApplicationStatus.ACCEPTED);
};

export const selectFilteredApplications = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  const { activeFilter } = state.tenantSelection;

  switch (activeFilter) {
    case FilterType.ALL:
      return applications;
    case FilterType.REJECTED:
      return applications.filter((app: TenantApplication) => app.status === TenantApplicationStatus.REJECTED);
    case FilterType.ACCEPTED:
      return applications.filter((app: TenantApplication) => app.status === TenantApplicationStatus.ACCEPTED);
    default:
      return applications;
  }
};

export const selectHasCurrentUserApplied = (state: RootState, propertyId: string, currentUserName?: string) => {
  if (!currentUserName) return false;
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.some((app: TenantApplication) => app.name === currentUserName);
};

// Property-specific count selector
export const selectAcceptedApplicantCountForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.filter((app: TenantApplication) => app.status === TenantApplicationStatus.ACCEPTED).length;
};

export default tenantSelectionSlice.reducer;