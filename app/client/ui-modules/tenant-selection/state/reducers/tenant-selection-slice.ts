import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { TenantApplication } from "../../types/TenantApplication";
import { TenantApplicationStatus } from "../../../../../shared/api-models/tenant-application/TenantApplicationStatus";
import { FilterType } from "../../enums/FilterType";
import { TenantSelectionUiState } from "../TenantSelectionUiState";
import { apiCreateTask, apiCreateTaskForAgent } from "/app/client/library-modules/apis/task/task-api";
import { TaskPriority } from "/app/shared/task-priority-identifier";
import { Role } from "/app/shared/user-role-identifier";
import {
  insertTenantApplication,
  updateTenantApplicationStatus
} from "/app/client/library-modules/domain-models/tenant-application/repositories/tenant-application-repository";
import { LoadTenantApplicationsUseCase } from "/app/client/library-modules/use-cases/tenant-application/LoadTenantApplicationsUseCase";
import {
  agentAcceptApplication,
  agentRejectApplication,
} from "../../../../library-modules/use-cases/tenant-application/AgentAcceptOrBackgroundUseCase";
import {
  landlordApproveApplication,
  landlordRejectApplication
} from "/app/client/library-modules/use-cases/tenant-application/LandlordApproveOrRejectUseCase";
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


// Agent reject tenant application (Step 1)
export const rejectTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/rejectTenantApplication",
  async (applicationId: string) => {
    await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.REJECTED, 1);
    return { applicationId, status: TenantApplicationStatus.REJECTED };
  }
);

// Agent accept tenant application (Step 1)
export const acceptTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/acceptTenantApplication",
  async (applicationId: string) => {
    await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.ACCEPTED, 1);
    return { applicationId, status: TenantApplicationStatus.ACCEPTED };
  }
);


// Landlord approve tenant application (Step 2)
export const landlordApproveTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/landlordApproveTenantApplication",
  async (applicationId: string) => {
    await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.LANDLORD_APPROVED, 2);
    return { applicationId, status: TenantApplicationStatus.LANDLORD_APPROVED };
  }
);

// Landlord reject tenant application (Step 2)
export const landlordRejectTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/landlordRejectTenantApplication",
  async (applicationId: string) => {
    await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.LANDLORD_REJECTED, 2);
    return { applicationId, status: TenantApplicationStatus.LANDLORD_REJECTED };
  }
);

// Send accepted applications to landlord (Step 2)
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
    const taskResult = await apiCreateTask({
      name: taskName,
      description: taskDescription,
      dueDate: dueDate,
      priority: TaskPriority.MEDIUM,
      propertyAddress: `${streetNumber} ${street}, ${suburb}, ${province} ${postcode}`,
      propertyId: propertyId,
      userType: Role.LANDLORD,
      userId: propertyLandlordId,
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

// Send approved applications to agent (Step 1)
export const sendApprovedApplicationsToAgentAsync = createAsyncThunk(
  "tenantSelection/sendApprovedApplicationsToAgent",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { propertyId, propertyLandlordId, streetNumber, street, suburb, province, postcode } = state.propertyListing;
    const { applicationsByProperty } = state.tenantSelection;

    if (!propertyId) {
      throw new Error('Property ID is required to send applications to agent');
    }

    if (!propertyLandlordId) {
      throw new Error('Property landlord ID is required to send applications to agent');
    }

    // Get tenant applications for the specific property
    const propertyApplications = applicationsByProperty[propertyId] || [];

    // Check if there are any landlord approved applications
    const approvedApplications = propertyApplications.filter((app: TenantApplication) =>
      app.status === TenantApplicationStatus.LANDLORD_APPROVED
    );

    if (approvedApplications.length === 0) {
      throw new Error('No approved applications to send to agent for background check');
    }


    const taskName = `Perform Background Check on ${approvedApplications.length} Tenant Application(s)`;
    const taskDescription = `Perform background checks on ${approvedApplications.length} landlord approved tenant application(s) for property at ${streetNumber} ${street}, ${suburb}, ${province} ${postcode}. Applicants: ${approvedApplications.map((app: TenantApplication) => app.name).join(', ')}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // Create task for agent
    const property = await getPropertyById(propertyId);
    const agentId = property.agentId;
    const taskResult = await apiCreateTask({
      name: taskName,
      description: taskDescription,
      dueDate: dueDate,
      priority: TaskPriority.MEDIUM,
      propertyAddress: `${streetNumber} ${street}, ${suburb}, ${province} ${postcode}`,
      propertyId: propertyId,
      userType: Role.AGENT,
      userId: agentId,
    });

    // Update all approved applications to BACKGROUND_CHECK_PASSED status (or create a new status for "pending background check")
    const approvedApplicationIds = approvedApplications.map((app: TenantApplication) => app.id);
    await updateTenantApplicationStatus(
      approvedApplicationIds,
      TenantApplicationStatus.BACKGROUND_CHECK_PENDING,
      3,
      taskResult // Passes the task ID to link applications to the task
    );

    console.log(`Successfully sent ${approvedApplications.length} application(s) to agent for background check for property ${propertyId}`);

    return {
      success: true,
      propertyId,
      approvedApplications: approvedApplicationIds,
      applicationCount: approvedApplications.length,
      taskId: taskResult
    };
  }
);

export const agentBackgroundCheckPassedAsync = createAsyncThunk(
  "tenantSelection/agentBackgroundCheckPassed",
  async (applicationId: string) => {
    await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.BACKGROUND_CHECK_PASSED, 3);
    return { applicationId, status: TenantApplicationStatus.BACKGROUND_CHECK_PASSED };
  }
);

export const agentBackgroundCheckFailedAsync = createAsyncThunk(
  "tenantSelection/agentBackgroundCheckFailed",
  async (applicationId: string) => {
    await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.BACKGROUND_CHECK_FAILED, 3);
    return { applicationId, status: TenantApplicationStatus.BACKGROUND_CHECK_FAILED };
  }
);

export const loadTenantApplicationsForPropertyAsync = createAsyncThunk(
  "tenantSelection/loadTenantApplicationsForProperty",
  async (propertyId: string) => {
    const useCase = new LoadTenantApplicationsUseCase();
    return await useCase.execute(propertyId);
  }
);



export const intentAcceptApplicationAsync = createAsyncThunk(
  "tenantSelection/intentAcceptApplication",
  async (args: { propertyId: string; applicationId: string }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const role = state.currentUser.authUser?.role;
    if (role === Role.AGENT) {
      await agentAcceptApplication(dispatch as any, () => getState() as RootState, args.propertyId, args.applicationId);
      return;
    }
    if (role === Role.LANDLORD) {
      await landlordApproveApplication(dispatch as any, () => getState() as RootState, args.propertyId, args.applicationId);
      return;
    }
  }
);

export const intentRejectApplicationAsync = createAsyncThunk(
  "tenantSelection/intentRejectApplication",
  async (args: { propertyId: string; applicationId: string }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const role = state.currentUser.authUser?.role;
    if (role === Role.AGENT) {
      await agentRejectApplication(dispatch as any, () => getState() as RootState, args.propertyId, args.applicationId);
      return;
    }
    if (role === Role.LANDLORD) {
      await landlordRejectApplication(dispatch as any, () => getState() as RootState, args.propertyId, args.applicationId);
      return;
    }
  }
)

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
      // Create tenant application (Step 1)
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

      // Agent rejects tenant application (Step 1)
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

      // Agent accepts tenant application (Step 1)
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

      // Landlord approves tenant application (Step 2)
      .addCase(landlordApproveTenantApplicationAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(landlordApproveTenantApplicationAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        updateApplicationStatus(state, action.payload.applicationId, TenantApplicationStatus.LANDLORD_APPROVED);
      })
      .addCase(landlordApproveTenantApplicationAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to approve application";
      })

      // Landlord rejects tenant application (Step 2)
      .addCase(landlordRejectTenantApplicationAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(landlordRejectTenantApplicationAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        updateApplicationStatus(state, action.payload.applicationId, TenantApplicationStatus.LANDLORD_REJECTED);
      })
      .addCase(landlordRejectTenantApplicationAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to reject application";
      })
        // Send approved applications to agent from landlord (Step 2)
      .addCase(sendApprovedApplicationsToAgentAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendApprovedApplicationsToAgentAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the status of applications to show they're with agent for background check
        const { approvedApplications } = action.payload;
        approvedApplications.forEach((applicationId: string) => {
          updateApplicationStatus(state, applicationId, TenantApplicationStatus.BACKGROUND_CHECK_PASSED);
        });
      })
      .addCase(sendApprovedApplicationsToAgentAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to send applications to agent";
      })
      .addCase(agentBackgroundCheckPassedAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(agentBackgroundCheckPassedAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        updateApplicationStatus(state, action.payload.applicationId, TenantApplicationStatus.BACKGROUND_CHECK_PASSED);
      })
      .addCase(agentBackgroundCheckPassedAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to pass background check";
      })

      .addCase(agentBackgroundCheckFailedAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(agentBackgroundCheckFailedAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        updateApplicationStatus(state, action.payload.applicationId, TenantApplicationStatus.BACKGROUND_CHECK_FAILED);
      })
      .addCase(agentBackgroundCheckFailedAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fail background check";
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

// Selector to check if there are landlord approved applications
export const selectHasLandlordApprovedApplicationsForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.some((app: TenantApplication) => app.status === TenantApplicationStatus.LANDLORD_APPROVED);
};

export const selectFilteredApplications = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  const { activeFilter } = state.tenantSelection;

  switch (activeFilter) {
    case FilterType.ALL:
      return applications;
    case FilterType.REJECTED:
      return applications.filter((app: TenantApplication) =>
        app.status === TenantApplicationStatus.REJECTED || app.status === TenantApplicationStatus.LANDLORD_REJECTED);
    case FilterType.ACCEPTED:
      return applications.filter((app: TenantApplication) =>
        app.status === TenantApplicationStatus.ACCEPTED || app.status === TenantApplicationStatus.LANDLORD_APPROVED);
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

// Step 1
export const selectAcceptedApplicantCountForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.filter((app: TenantApplication) => app.status === TenantApplicationStatus.ACCEPTED).length;
};

// Step 2
export const selectLandlordApprovedApplicantCountForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.filter((app: TenantApplication) => app.status === TenantApplicationStatus.LANDLORD_APPROVED).length;
};


export default tenantSelectionSlice.reducer;