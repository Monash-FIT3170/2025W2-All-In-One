import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { TenantApplication } from "../../types/TenantApplication";
import { TenantApplicationStatus } from "../../../../../shared/api-models/tenant-application/TenantApplicationStatus";
import { FilterType } from "../../enums/FilterType";
import { TenantSelectionUiState } from "../TenantSelectionUiState";
import { apiCreateTaskForLandlord } from "/app/client/library-modules/apis/task/task-api";
import { TaskPriority } from "/app/shared/task-priority-identifier";
import {
  insertTenantApplication,
  updateTenantApplicationStatus
} from "/app/client/library-modules/domain-models/tenant-application/repositories/tenant-application-repository";
import { LoadTenantApplicationsUseCase } from "/app/client/library-modules/use-cases/tenant-application/LoadTenantApplicationsUseCase";
import { getPropertyById } from "/app/client/library-modules/domain-models/property/repositories/property-repository";

const initialState: TenantSelectionUiState = {
  applicationsByProperty: {},
  activeFilter: FilterType.ALL,
  isLoading: false,
  error: null,
  currentStep: 1,
};
// Creating tenant applications
export const createTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/createTenantApplication",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { propertyId, propertyLandlordId} = state.propertyListing;
    const { currentUser, profileData } = state.currentUser;

    if (!currentUser) {
      throw new Error('User must be logged in to apply');
    }

    if (!propertyId) {
      throw new Error('Property ID is required to create application');
    }

    // Get user's name from profile data or use a default
    let applicantName: string;
    if (profileData) {
      applicantName = `${profileData.firstName} ${profileData.lastName}`;
    } else if ('tenantId' in currentUser) {
      applicantName = `Tenant ${currentUser.tenantId.slice(-4)}`;
    } else {
      throw new Error('Only tenants can apply for properties. Invalid user type detected.');
    }

    // Get the property to retrieve the agentId
    const property = await getPropertyById(propertyId);
    const agentId = property.agentId;

    // Insert the tenant application into the database
    const applicationId = await insertTenantApplication({
      propertyId,
      applicantName,
      agentId: agentId,
      landlordId: propertyLandlordId,
    });

    return {
      applicationId,
      applicantName,
      propertyId,
      propertyLandlordId,
      status: TenantApplicationStatus.UNDETERMINED,
    };
  }
);

export const rejectTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/rejectTenantApplication",
  async (applicationId: string) => {
    await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.REJECTED, 1);
    return { applicationId, status: TenantApplicationStatus.REJECTED };
  }
);

export const acceptTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/acceptTenantApplication",
  async (applicationId: string) => {
    await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.ACCEPTED, 1);
    return { applicationId, status: TenantApplicationStatus.ACCEPTED };
  }
);

export const sendAcceptedApplicationsToLandlordAsync = createAsyncThunk(
  "tenantSelection/sendAcceptedApplicationsToLandlord",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { propertyId, propertyLandlordId, streetNumber, street, suburb, province, postcode } = state.propertyListing;
    const { applicationsByProperty } = state.tenantSelection;

    if (!propertyId) {
      throw new Error('Property ID is required to send applications to landlord');
    }

    if (!propertyLandlordId) {
      throw new Error('Property landlord ID is required to send tenant to landlord');
    }

    // Get tenant applications for the specific property
    const propertyApplications = applicationsByProperty[propertyId] || [];

    // Check if there are any accepted applications
    const acceptedApplications = propertyApplications.filter((app: TenantApplication) =>
      app.status === TenantApplicationStatus.ACCEPTED
    );

    if (acceptedApplications.length === 0) {
      throw new Error('No accepted applications to send to landlord');
    }

    // Create task for landlord
    const taskName = `Review ${acceptedApplications.length} Tenant Application(s)`;
    const taskDescription = `Review ${acceptedApplications.length} accepted tenant application(s) for property at ${streetNumber} ${street}, ${suburb}, ${province} ${postcode}. Applicants: ${acceptedApplications.map((app: TenantApplication) => app.name).join(', ')}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // Create task for landlord
    const taskResult = await apiCreateTaskForLandlord({
      name: taskName,
      description: taskDescription,
      dueDate: dueDate,
      priority: TaskPriority.MEDIUM,
      landlordId: propertyLandlordId,
    });

    // Update all accepted applications to LANDLORD_REVIEW status
    const acceptedApplicationIds = acceptedApplications.map((app: TenantApplication) => app.id);
    await updateTenantApplicationStatus(
      acceptedApplicationIds,
      TenantApplicationStatus.LANDLORD_REVIEW,
      2,
      taskResult // Passes the task ID to link applications to the task
    );

    console.log(`Successfully sent ${acceptedApplications.length} application(s) to landlord ${propertyLandlordId} for property ${propertyId}`);

    return {
      success: true,
      propertyId,
      acceptedApplications: acceptedApplicationIds,
      applicationCount: acceptedApplications.length,
      taskId: taskResult
    };
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
  },
  extraReducers: (builder) => {
    builder
      // Create tenant application
      .addCase(createTenantApplicationAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTenantApplicationAsync.fulfilled, (state, action) => {
        const { propertyId } = action.payload;
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