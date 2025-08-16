import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { TenantApplication } from "../../types/TenantApplication";
import { TenantApplicationStatus } from "../../enums/TenantApplicationStatus";
import { FilterType } from "../../enums/FilterType";
import { ReviewTenantUiState } from "../ReviewTenantUiState";
import { apiCreateTaskForLandlord } from "/app/client/library-modules/apis/task/task-api";
import { TaskPriority } from "/app/shared/task-priority-identifier";

// Mock data
const initialState: ReviewTenantUiState = {
  applications: [
    {
      id: '1',
      name: 'Rehan W',
      status: TenantApplicationStatus.UNDETERMINED,
    },
    {
      id: '2',
      name: 'Dylan C',
      status: TenantApplicationStatus.UNDETERMINED,
    },
    {
      id: '3',
      name: 'Tony X',
      status: TenantApplicationStatus.UNDETERMINED,
    },
    {
      id: '4',
      name: 'Shannon W',
      status: TenantApplicationStatus.REJECTED,
    },
    {
      id: '5',
      name: 'Ashleigh C',
      status: TenantApplicationStatus.ACCEPTED,
    },
    {
      id: '6',
      name: 'Maddy C',
      status: TenantApplicationStatus.ACCEPTED,
    },
  ],
  activeFilter: FilterType.ALL,
  isLoading: false,
  error: null,
  currentStep: 1,
  isModalOpen: false,
  acceptedCount: 2,
  rejectedCount: 1,
  undeterminedCount: 3,
  hasAcceptedApplications: true,
  canSendToLandlord: true,
};


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
    const { applications } = state.tenantSelection;

    if (!propertyLandlordId) {
      throw new Error('Property landlord ID is required to send tenant to landlord');
    }

    // Check if there are any accepted applications
    const acceptedApplications = applications.filter((app: TenantApplication) =>
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
      acceptedApplications: acceptedApplications.map((app: TenantApplication) => app.id),
      applicationCount: acceptedApplications.length
    };
  }
);


export const tenantSelectionSlice = createSlice({
  name: "tenantSelection",
  initialState,
  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
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
    updateApplicationCounts: (state) => {
      state.acceptedCount = state.applications.filter(
        (app: TenantApplication) => app.status === TenantApplicationStatus.ACCEPTED
      ).length;
      state.rejectedCount = state.applications.filter(
        (app: TenantApplication) => app.status === TenantApplicationStatus.REJECTED
      ).length;
      state.undeterminedCount = state.applications.filter(
        (app: TenantApplication) => app.status === TenantApplicationStatus.UNDETERMINED
      ).length;
      state.hasAcceptedApplications = state.acceptedCount > 0;
      state.canSendToLandlord = state.hasAcceptedApplications;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reject tenant application
      .addCase(rejectTenantApplicationAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectTenantApplicationAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update application status in state
        state.applications = state.applications.map((app: TenantApplication) =>
          app.id === action.payload.applicationId
            ? { ...app, status: TenantApplicationStatus.REJECTED }
            : app
        );
        // Update counts
        tenantSelectionSlice.caseReducers.updateApplicationCounts(state);
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
        // Update application status in state
        state.applications = state.applications.map((app: TenantApplication) =>
          app.id === action.payload.applicationId
            ? { ...app, status: TenantApplicationStatus.ACCEPTED }
            : app
        );
        // Update counts
        tenantSelectionSlice.caseReducers.updateApplicationCounts(state);
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
        // Update all accepted applications to landlord review status
        state.applications = state.applications.map((app: TenantApplication) =>
          app.status === TenantApplicationStatus.ACCEPTED
            ? { ...app, status: TenantApplicationStatus.LANDLORD_REVIEW, step: 2 }
            : app
        );
        state.currentStep = 2;
        // Update counts
        tenantSelectionSlice.caseReducers.updateApplicationCounts(state);
      })
      .addCase(sendAcceptedApplicationsToLandlordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to send applications to landlord";
      });
  },
});


export const {
  setApplications,
  setFilter,
  setCurrentStep,
  setModalOpen,
  clearError,
  updateApplicationCounts
} = tenantSelectionSlice.actions;


export const selectTenantSelectionState = (state: RootState) => state.tenantSelection;
export const selectApplications = (state: RootState) => state.tenantSelection.applications;
export const selectActiveFilter = (state: RootState) => state.tenantSelection.activeFilter;
export const selectIsLoading = (state: RootState) => state.tenantSelection.isLoading;
export const selectError = (state: RootState) => state.tenantSelection.error;
export const selectCurrentStep = (state: RootState) => state.tenantSelection.currentStep;
export const selectIsModalOpen = (state: RootState) => state.tenantSelection.isModalOpen;
export const selectAcceptedCount = (state: RootState) => state.tenantSelection.acceptedCount;
export const selectRejectedCount = (state: RootState) => state.tenantSelection.rejectedCount;
export const selectUndeterminedCount = (state: RootState) => state.tenantSelection.undeterminedCount;
export const selectHasAcceptedApplications = (state: RootState) => state.tenantSelection.hasAcceptedApplications;
export const selectCanSendToLandlord = (state: RootState) => state.tenantSelection.canSendToLandlord;


export const selectFilteredApplications = (state: RootState) => {
  const { applications, activeFilter } = state.tenantSelection;

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
