import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { TenantApplication } from "../../types/TenantApplication";
import { TenantApplicationStatus } from "../../enums/TenantApplicationStatus";
import { FilterType } from "../../enums/FilterType";
import { ReviewTenantUiState } from "../ReviewTenantUiState";
import { apiCreateTaskForLandlord } from "/app/client/library-modules/apis/task/task-api";
import { TaskPriority } from "/app/shared/task-priority-identifier";

// Mock data - now organized by property
const initialState: ReviewTenantUiState = {
  applicationsByProperty: {},

  activeFilter: FilterType.ALL,
  isLoading: false,
  error: null,
  currentStep: 1,
  isModalOpen: false,
};

// Creating tenant applications
export const createTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/createTenantApplication",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { propertyId, propertyLandlordId} = state.propertyListing;
    const { currentUser, profileData } = state.currentUser;

    console.log("=== createTenantApplicationAsync called ===");
    console.log("Property ID:", propertyId);
    console.log("Current user:", currentUser);
    console.log("Profile data:", profileData);

    if (!currentUser) {
      throw new Error('User must be logged in to apply');
    }

    if (!propertyId) {
      throw new Error('Property ID is required to create application');
    }

    // Generate a unique ID for the new application
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get user's name from profile data or use a default
    let applicantName: string;
    if (profileData) {
      applicantName = `${profileData.firstName} ${profileData.lastName}`;
    } else if ('tenantId' in currentUser) {
      applicantName = `Tenant ${currentUser.tenantId.slice(-4)}`;
    } else {
      throw new Error('Only tenants can apply for properties. Invalid user type detected.');
    }

    console.log(`Creating tenant application for ${applicantName} on property ${propertyId}`);

    const result = {
      applicationId,
      applicantName,
      propertyId,
      propertyLandlordId,
      status: TenantApplicationStatus.UNDETERMINED,
    };

    console.log("Returning result:", result);
    return result;
  }
);

export const rejectTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/rejectTenantApplication",
  async (applicationId: string, { getState }) => {
    const state = getState() as RootState;
    const { propertyId, propertyLandlordId } = state.propertyListing;

    console.log(`Rejected application ${applicationId} for property ${propertyId}`);

    return { applicationId, status: 'REJECTED' };
  }
);

export const acceptTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/acceptTenantApplication",
  async (applicationId: string, { getState }) => {
    const state = getState() as RootState;
    const { propertyId, propertyLandlordId } = state.propertyListing;

    console.log(`Accepted application ${applicationId} for property ${propertyId}`);

    return { applicationId, status: 'ACCEPTED' };
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

    await apiCreateTaskForLandlord({
      name: taskName,
      description: taskDescription,
      dueDate: dueDate,
      priority: TaskPriority.MEDIUM,
      landlordId: propertyLandlordId,
    });

    console.log(`Successfully sent ${acceptedApplications.length} application(s) to landlord ${propertyLandlordId} for property ${propertyId}`);

    return {
      success: true,
      propertyId,
      acceptedApplications: acceptedApplications.map((app: TenantApplication) => app.id),
      applicationCount: acceptedApplications.length
    };
  }
);


export const tenantSelectionSlice = createSlice({
  name: "tenantSelection",
  initialState,
  reducers: {

    setFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
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
        console.log("=== createTenantApplicationAsync.fulfilled ===");
        console.log("Action payload:", action.payload);

        const { propertyId } = action.payload;
        const propertyApplications = state.applicationsByProperty[propertyId] || [];
        console.log("Current applications count for property:", propertyApplications.length);

        state.isLoading = false;
        // Add new application to state
        const newApplication: TenantApplication = {
          id: action.payload.applicationId,
          name: action.payload.applicantName,
          status: action.payload.status,
        };

        console.log("Adding new application:", newApplication);

        // Initialize property array if it doesn't exist
        if (!state.applicationsByProperty[propertyId]) {
          state.applicationsByProperty[propertyId] = [];
        }

        state.applicationsByProperty[propertyId].push(newApplication);
        console.log("Applications after adding:", state.applicationsByProperty[propertyId]);

        console.log("Application added successfully to property:", propertyId);
      })
      .addCase(createTenantApplicationAsync.rejected, (state, action) => {
        console.log("=== createTenantApplicationAsync.rejected ===");
        console.log("Error:", action.error);
        console.log("Error message:", action.error.message);

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
        // Find the property that contains this application
        const { applicationId } = action.payload;
        let propertyId: string | null = null;

        for (const [pid, applications] of Object.entries(state.applicationsByProperty)) {
          if (applications.some(app => app.id === applicationId)) {
            propertyId = pid;
            break;
          }
        }

        if (propertyId) {
          // Update application status in state
          state.applicationsByProperty[propertyId] = state.applicationsByProperty[propertyId].map((app: TenantApplication) =>
            app.id === applicationId
              ? { ...app, status: TenantApplicationStatus.REJECTED }
              : app
          );
        }
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
        // Find the property that contains this application
        const { applicationId } = action.payload;
        let propertyId: string | null = null;

        for (const [pid, applications] of Object.entries(state.applicationsByProperty)) {
          if (applications.some(app => app.id === applicationId)) {
            propertyId = pid;
            break;
          }
        }

        if (propertyId) {
          // Update application status in state
          state.applicationsByProperty[propertyId] = state.applicationsByProperty[propertyId].map((app: TenantApplication) =>
            app.id === applicationId
              ? { ...app, status: TenantApplicationStatus.ACCEPTED }
              : app
          );
        }
      })
      .addCase(acceptTenantApplicationAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to accept application";
      })

      // Send to landlord
      .addCase(sendAcceptedApplicationsToLandlordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendAcceptedApplicationsToLandlordAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Get the property ID from the action payload or find it from accepted applications
        const { propertyId } = action.payload;

        if (propertyId && state.applicationsByProperty[propertyId]) {
          // Update all accepted applications to landlord review status for this property
          state.applicationsByProperty[propertyId] = state.applicationsByProperty[propertyId].map((app: TenantApplication) =>
            app.status === TenantApplicationStatus.ACCEPTED
              ? { ...app, status: TenantApplicationStatus.LANDLORD_REVIEW, step: 2 }
              : app
          );
          state.currentStep = 2;
        }
      })
      .addCase(sendAcceptedApplicationsToLandlordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to send applications to landlord";
      });
  },
});


export const {
  setFilter,
  setCurrentStep,
  setModalOpen,
  clearError,
} = tenantSelectionSlice.actions;


export const selectTenantSelectionState = (state: RootState) => state.tenantSelection;
export const selectApplicationsByProperty = (state: RootState) => state.tenantSelection.applicationsByProperty;
export const selectActiveFilter = (state: RootState) => state.tenantSelection.activeFilter;
export const selectIsLoading = (state: RootState) => state.tenantSelection.isLoading;
export const selectError = (state: RootState) => state.tenantSelection.error;
export const selectCurrentStep = (state: RootState) => state.tenantSelection.currentStep;
export const selectIsModalOpen = (state: RootState) => state.tenantSelection.isModalOpen;

// Helper selector to get applications for a specific property
export const selectApplicationsForProperty = (state: RootState, propertyId: string) => {
  return state.tenantSelection.applicationsByProperty[propertyId] || [];
};

// Property-specific count selectors
export const selectAcceptedApplicantCountForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.filter((app: TenantApplication) => app.status === TenantApplicationStatus.ACCEPTED).length;
};

export const selectRejectedApplicantCountForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.filter((app: TenantApplication) => app.status === TenantApplicationStatus.REJECTED).length;
};

export const selectUndeterminedApplicantCountForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.filter((app: TenantApplication) => app.status === TenantApplicationStatus.UNDETERMINED).length;
};

export const selectHasAcceptedApplicationsForProperty = (state: RootState, propertyId: string) => {
  return selectAcceptedApplicantCountForProperty(state, propertyId) > 0;
};

export const selectCanSendToLandlordForProperty = (state: RootState, propertyId: string) => {
  return selectHasAcceptedApplicationsForProperty(state, propertyId);
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

export default tenantSelectionSlice.reducer;
