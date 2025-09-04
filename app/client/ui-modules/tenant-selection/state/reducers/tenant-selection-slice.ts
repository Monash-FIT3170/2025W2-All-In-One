import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { TenantApplication as DomainTenantApplication } from "/app/client/library-modules/domain-models/tenant-application/TenantApplication"
import { TenantApplicationStatus } from "../../../../../shared/api-models/tenant-application/TenantApplicationStatus";
import { FilterType } from "../../enums/FilterType";
import { TenantSelectionUiState } from "../TenantSelectionUiState";
import { Role } from "/app/shared/user-role-identifier";
import {
  updateTenantApplicationStatus
} from "/app/client/library-modules/domain-models/tenant-application/repositories/tenant-application-repository";
import { LoadTenantApplicationsUseCase } from "/app/client/library-modules/use-cases/tenant-application/LoadTenantApplicationsUseCase";

import {
  sendAcceptedApplicationsToLandlordUseCase,
  sendBackgroundPassedToLandlordUseCase
} from "../../../../library-modules/use-cases/tenant-application/SendTenantApplicationToLandlordUseCase";
import { createTenantApplicationUseCase } from "/app/client/library-modules/use-cases/tenant-application/CreateTenantApplicationUseCase";
import {
  sendApprovedApplicationsToAgentUseCase,
  sendFinalApprovedApplicationToAgentUseCase
} from "/app/client/library-modules/use-cases/tenant-application/SendTenantApplicationToAgentUseCase";
import { agentAcceptApplication, agentRejectApplication, landLordApproveApplication, landLordRejectApplication } from "../../../../library-modules/use-cases/tenant-application/AcceptOrRejectTenantApplicationUseCase.ts";
import { AppDispatch } from "/app/client/store";

const initialState: TenantSelectionUiState = {
  applicationsByProperty: {},
  activeFilter: FilterType.ALL,
  isLoading: false,
  error: null,
  currentStep: 1,
};

export const createTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/createTenantApplication",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { propertyId, propertyLandlordId} = state.propertyListing;
    const { currentUser, profileData, authUser } = state.currentUser;

    // Validate landlord ID
    if (!propertyLandlordId || propertyLandlordId.trim() === "") {
      throw new Error('Property landlord ID is missing. This property may not have a valid landlord assigned.');
    }

    const result = await createTenantApplicationUseCase({
      propertyId,
      propertyLandlordId,
      currentUser,
      profileData,
      authUser,
      tenantUserId: 'tenantId' in (currentUser || {}) ? (currentUser as { tenantId: string }).tenantId : "",
    });

    if (!result.success) {
      throw new Error(result.message);
    }

    return {
      applicationId: result.applicationId!,
      applicantName: result.applicantName!,
      propertyId: result.propertyId!,
      status: result.status!,
      agentId: result.agentId!,
      landlordId: result.propertyLandlordId!,
      tenantUserId: result.tenantUserId!,
      success: true,
      message: result.message,
    };
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

// Agent reject tenant application (Step 1)
export const rejectTenantApplicationAsync = createAsyncThunk(
  "tenantSelection/rejectTenantApplication",
  async (applicationId: string) => {
    await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.REJECTED, 1);
    return { applicationId, status: TenantApplicationStatus.REJECTED };
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

// Send accepted applications to landlord (Step 1 -> Step 2)
export const sendAcceptedApplicationsToLandlordAsync = createAsyncThunk(
  "tenantSelection/sendAcceptedApplicationsToLandlord",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { propertyId, propertyLandlordId, streetNumber, street, suburb, province, postcode } = state.propertyListing;
    const { applicationsByProperty } = state.tenantSelection;

    // Get tenant applications for the specific property
    const propertyApplications = applicationsByProperty[propertyId] || [];

    // Check if there are any accepted applications
    const acceptedApplications = propertyApplications.filter((app) =>
      app.status === TenantApplicationStatus.ACCEPTED
    );

    // Use domain applications directly since they already have Date objects
    const acceptedApplicationsDomain: DomainTenantApplication[] = acceptedApplications;

    return await sendAcceptedApplicationsToLandlordUseCase(
      propertyId,
      propertyLandlordId,
      streetNumber,
      street,
      suburb,
      province,
      postcode,
      acceptedApplicationsDomain
    );
  }
);

// Send approved applications to agent (Step 2 -> Step 3)
export const sendApprovedApplicationsToAgentAsync = createAsyncThunk(
  "tenantSelection/sendApprovedApplicationsToAgent",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { propertyId, propertyLandlordId, streetNumber, street, suburb, province, postcode } = state.propertyListing;
    const { applicationsByProperty } = state.tenantSelection;

    // Get tenant applications for the specific property
    const propertyApplications = applicationsByProperty[propertyId] || [];

    // Check if there are any landlord approved applications
    const approvedApplications = propertyApplications.filter((app: DomainTenantApplication) =>
      app.status === TenantApplicationStatus.LANDLORD_APPROVED
    );

    return await sendApprovedApplicationsToAgentUseCase(
      propertyId,
      propertyLandlordId,
      streetNumber,
      street,
      suburb,
      province,
      postcode,
      approvedApplications
    );
  }
);

// Send final approved application to agent (Step 4 -> Step 5)
export const sendFinalApprovedApplicationToAgentAsync = createAsyncThunk(
  "tenantSelection/sendFinalApprovedApplicationToAgent",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { propertyId, propertyLandlordId, streetNumber, street, suburb, province, postcode } = state.propertyListing;
    const apps = state.tenantSelection.applicationsByProperty[propertyId] || [];
    const finalApproved = apps.filter(a => a.status === TenantApplicationStatus.FINAL_APPROVED);

    return await sendFinalApprovedApplicationToAgentUseCase(
      propertyId,
      propertyLandlordId,
      streetNumber,
      street,
      suburb,
      province,
      postcode,
      finalApproved
    );
  }
);

// Send Background passed applicants to landlord (Step 3 -> Step 4)
export const sendBackgroundPassedToLandlordAsync = createAsyncThunk(
  "tenantSelection/sendBackgroundPassedToLandlord",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { propertyId, propertyLandlordId, streetNumber, street, suburb, province, postcode } = state.propertyListing;
    const apps = state.tenantSelection.applicationsByProperty[propertyId] || [];
    const passed = apps.filter(a => a.status === TenantApplicationStatus.BACKGROUND_CHECK_PASSED);

    return await sendBackgroundPassedToLandlordUseCase(
      propertyId,
      propertyLandlordId,
      streetNumber, street, suburb, province, postcode,
      passed
    );
  }
)

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

export const landLordFinalApprovedAsync = createAsyncThunk(
  "tenantSelection/landLordFinalApproved",
  async (applicationId: string) => {
    await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.FINAL_APPROVED, 4)
    return {applicationId, status: TenantApplicationStatus.FINAL_APPROVED}
  }
);

export const landLordFinalRejectedAsync = createAsyncThunk(
  "tenantSelection/landLordFinalRejected",
  async (applicationId: string) => {
    await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.FINAL_REJECTED, 4)
    return {applicationId, status: TenantApplicationStatus.FINAL_REJECTED}
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
      await agentAcceptApplication(dispatch as AppDispatch, () => getState() as RootState, args.propertyId, args.applicationId);
      return;
    }
    if (role === Role.LANDLORD) {
      await landLordApproveApplication(dispatch as AppDispatch, () => getState() as RootState, args.propertyId, args.applicationId);
      return;
    }
    throw new Error("Action not allowed");
  }
);

export const intentRejectApplicationAsync = createAsyncThunk(
  "tenantSelection/intentRejectApplication",
  async (args: { propertyId: string; applicationId: string }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const role = state.currentUser.authUser?.role;

    if (role === Role.AGENT) {
      await agentRejectApplication(dispatch as AppDispatch, () => getState() as RootState, args.propertyId, args.applicationId);
      return;
    }
    if (role === Role.LANDLORD) {
      await landLordRejectApplication(dispatch as AppDispatch, () => getState() as RootState, args.propertyId, args.applicationId);
      return;
    }
    throw new Error("Action not allowed");
  }
);

export const intentSendApplicationToLandlordAsync = createAsyncThunk(
  "tenantSelection/intentSendApplicationToLandlord",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const propertyId = state.propertyListing.propertyId;
    const apps = state.tenantSelection.applicationsByProperty[propertyId] || [];

    const hasAccepted = apps.some(a => a.status === TenantApplicationStatus.ACCEPTED);
    if (hasAccepted) {
      return await dispatch(sendAcceptedApplicationsToLandlordAsync()).unwrap();
    }

    const hasBackgroundPassed = apps.some(a => a.status === TenantApplicationStatus.BACKGROUND_CHECK_PASSED);
    if (hasBackgroundPassed) {
      return await dispatch(sendBackgroundPassedToLandlordAsync()).unwrap();
    }
  }
);

export const intentSendApplicationToAgentAsync = createAsyncThunk(
  "tenantSelection/intentSendApplicationToAgent",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const propertyId = state.propertyListing.propertyId;
    const apps = state.tenantSelection.applicationsByProperty[propertyId] || [];

    const hasApproved = apps.some(a => a.status === TenantApplicationStatus.LANDLORD_APPROVED);
    if (hasApproved) {
      return await dispatch(sendApprovedApplicationsToAgentAsync()).unwrap();
    }

    const hasFinalApproved = apps.some(a => a.status === TenantApplicationStatus.FINAL_APPROVED);
    if (hasFinalApproved) {
      return await dispatch(sendFinalApprovedApplicationToAgentAsync()).unwrap();
    }
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
  },
  extraReducers: (builder) => {
    builder
      // Create tenant application (Step 1)
      .addCase(createTenantApplicationAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTenantApplicationAsync.fulfilled, (state, action) => {
        const propertyId = action.payload.propertyId;
        state.isLoading = false;

        const now = new Date().toISOString();
        const newApplication = {
          id: action.payload.applicationId,
          propertyId,
          applicantName: action.payload.applicantName,
          status: action.payload.status,
          step: 1,
          createdAt: now,
          updatedAt: now,
          agentId: action.payload.agentId || "",
          landlordId: action.payload.landlordId || "",
          tenantUserId: action.payload.tenantUserId || "",
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
        const applicationId = action.meta.arg as string;
        updateApplicationStatus(state, applicationId, TenantApplicationStatus.REJECTED);
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
        const applicationId = action.meta.arg as string;
        updateApplicationStatus(state, applicationId, TenantApplicationStatus.ACCEPTED);
      })
      .addCase(acceptTenantApplicationAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to accept application";
      })

      .addCase(sendAcceptedApplicationsToLandlordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendAcceptedApplicationsToLandlordAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const { acceptedApplications } = action.payload;
        acceptedApplications.forEach((applicationId: string) => {
          updateApplicationStatus(state, applicationId, TenantApplicationStatus.LANDLORD_REVIEW);
        });
      })
      .addCase(sendAcceptedApplicationsToLandlordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to send accepted applications to landlord";
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
        const { approvedApplications } = action.payload;
        approvedApplications.forEach((applicationId: string) => {
          updateApplicationStatus(state, applicationId, TenantApplicationStatus.BACKGROUND_CHECK_PENDING);
        });
      })
      .addCase(sendApprovedApplicationsToAgentAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to send approved applications to agent";
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
        // Send background passed applications to landlord
      .addCase(sendBackgroundPassedToLandlordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendBackgroundPassedToLandlordAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const { passedApplications } = action.payload;
        passedApplications.forEach((id: string) => {
          updateApplicationStatus(state, id, TenantApplicationStatus.FINAL_REVIEW);
        });
      })
      .addCase(sendBackgroundPassedToLandlordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to send background passed applications to landlord";
      })

      .addCase(landLordFinalApprovedAsync.fulfilled, (state, action) => {
        updateApplicationStatus(state, action.payload.applicationId, TenantApplicationStatus.FINAL_APPROVED);
      })
      .addCase(landLordFinalRejectedAsync.fulfilled, (state, action) => {
        updateApplicationStatus(state, action.payload.applicationId, TenantApplicationStatus.FINAL_REJECTED);
      })
      .addCase(sendFinalApprovedApplicationToAgentAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendFinalApprovedApplicationToAgentAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        updateApplicationStatus(state, action.payload.applicationId, TenantApplicationStatus.TENANT_CHOSEN);
      })
      .addCase(sendFinalApprovedApplicationToAgentAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to send final approved application to agent";
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
        state.applicationsByProperty[propertyId] = applications as DomainTenantApplication[];
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
  return applications.some((app: DomainTenantApplication) => app.status === TenantApplicationStatus.ACCEPTED);
};

export const selectHasLandlordApprovedApplicationsForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.some((app: DomainTenantApplication) => app.status === TenantApplicationStatus.LANDLORD_APPROVED);
};
export const selectHasBackgroundPassedApplicationsForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.some((app: DomainTenantApplication) => app.status === TenantApplicationStatus.BACKGROUND_CHECK_PASSED)
}

export const selectHasFinalApprovedApplicationForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.some((app: DomainTenantApplication) => app.status === TenantApplicationStatus.FINAL_APPROVED);
};

export const selectFilteredApplications = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  const { activeFilter } = state.tenantSelection;

  switch (activeFilter) {
    case FilterType.ALL:
      return applications;
    case FilterType.REJECTED:
      return applications.filter((app: DomainTenantApplication) => app.status === TenantApplicationStatus.REJECTED);
    case FilterType.ACCEPTED:
      return applications.filter((app: DomainTenantApplication) => app.status === TenantApplicationStatus.ACCEPTED);
    default:
      return applications;
  }
};

export const selectHasCurrentUserApplied = (state: RootState, propertyId: string, currentUserName?: string) => {
  if (!currentUserName) return false;
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.some((app: DomainTenantApplication) => app.applicantName === currentUserName);
};



// Step 1 agent accepted applicant count
export const selectAcceptedApplicantCountForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.filter((app: DomainTenantApplication) => app.status === TenantApplicationStatus.ACCEPTED).length;
};

// Step 2 landlord approved applicant count
export const selectLandlordApprovedApplicantCountForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.filter((app: DomainTenantApplication) => app.status === TenantApplicationStatus.LANDLORD_APPROVED).length;
};
// Step 3 background check passed applicant count
export const selectBackgroundPassedApplicantCountForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.filter((app: DomainTenantApplication) => app.status === TenantApplicationStatus.BACKGROUND_CHECK_PASSED).length;
};

// Step 4 final approved applicant count
export const selectFinalApprovedApplicantCountForProperty = (state: RootState, propertyId: string) => {
  const applications = selectApplicationsForProperty(state, propertyId);
  return applications.filter((app: DomainTenantApplication) => app.status === TenantApplicationStatus.FINAL_APPROVED).length;
};
export default tenantSelectionSlice.reducer;