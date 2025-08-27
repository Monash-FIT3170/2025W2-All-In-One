import { sendBackgroundPassedToLandlordUseCase } from "./ProcessTenantApplicationUseCase";
import { RootState } from "/app/client/store";
import { AppDispatch } from "/app/client/store";
import {
  acceptTenantApplicationAsync,
  rejectTenantApplicationAsync,
  agentBackgroundCheckPassedAsync,
  agentBackgroundCheckFailedAsync,
  selectApplicationsForProperty,
  landlordApproveTenantApplicationAsync,
  landLordFinalApprovedAsync,
  landlordRejectTenantApplicationAsync,
  landLordFinalRejectedAsync,
  sendAcceptedApplicationsToLandlordAsync,
  sendBackgroundPassedToLandlordAsync,
  sendApprovedApplicationsToAgentAsync,
  sendFinalApprovedApplicationsToAgentAsync,
} from "/app/client/ui-modules/tenant-selection/state/reducers/tenant-selection-slice";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";

function getApplicationStatus(
  getState: () => RootState,
  propertyId: string,
  applicationId: string
): TenantApplicationStatus | undefined {
  const apps = selectApplicationsForProperty(getState(), propertyId);
  return apps.find(a => a.id === applicationId)?.status;
}

export async function agentAcceptApplication(
  dispatch: AppDispatch,
  getState: () => RootState,
  propertyId: string,
  applicationId: string
): Promise<void> {
  const status = getApplicationStatus(getState, propertyId, applicationId);

  if (status === TenantApplicationStatus.UNDETERMINED) {
    await dispatch(acceptTenantApplicationAsync(applicationId)).unwrap();
    return;
  }

  if (status === TenantApplicationStatus.BACKGROUND_CHECK_PENDING) {
    await dispatch(agentBackgroundCheckPassedAsync(applicationId)).unwrap();
    return;
  }
}

export async function agentRejectApplication(
  dispatch: AppDispatch,
  getState: () => RootState,
  propertyId: string,
  applicationId: string
): Promise<void> {
  const status = getApplicationStatus(getState, propertyId, applicationId);

  if (status === TenantApplicationStatus.UNDETERMINED) {
    await dispatch(rejectTenantApplicationAsync(applicationId)).unwrap();
    return;
  }

  if (status === TenantApplicationStatus.BACKGROUND_CHECK_PENDING) {
    await dispatch(agentBackgroundCheckFailedAsync(applicationId)).unwrap();
    return;
  }

}

export async function landLordApproveApplication(
  dispatch: AppDispatch,
  getState: () => RootState,
  propertyId: string,
  applicationId: string
): Promise<void> {
  const status = getApplicationStatus(getState, propertyId, applicationId);

  if (status === TenantApplicationStatus.LANDLORD_REVIEW) {
    await dispatch(landlordApproveTenantApplicationAsync(applicationId)).unwrap();
    return;
  }

  if (status === TenantApplicationStatus.FINAL_REVIEW) {
    await dispatch(landLordFinalApprovedAsync(applicationId)).unwrap();
    return;
  }

}

export async function landLordRejectApplication(
  dispatch: AppDispatch,
  getState: () => RootState,
  propertyId: string,
  applicationId: string
): Promise<void> {
  const status = getApplicationStatus(getState, propertyId, applicationId);

  if (status === TenantApplicationStatus.LANDLORD_REVIEW) {
    await dispatch(landlordRejectTenantApplicationAsync(applicationId)).unwrap();
    return;
  }

  if (status === TenantApplicationStatus.FINAL_REVIEW) {
    await dispatch(landLordFinalRejectedAsync(applicationId)).unwrap();
    return;
  }

}

// export async function agentSendApplicationToLandlord(
//   dispatch: AppDispatch,
//   getState: () => RootState,
//   propertyId: string,
//   applicationId: string
// ): Promise<void> {
//   const status = getApplicationStatus(getState, propertyId, applicationId);

//   if (status === TenantApplicationStatus.ACCEPTED) {
//     await dispatch(sendAcceptedApplicationsToLandlordAsync()).unwrap();
//     return;
//   }

//   if (status === TenantApplicationStatus.BACKGROUND_CHECK_PENDING) {
//     await dispatch(sendBackgroundPassedToLandlordAsync()).unwrap();
//     return;
//   }
// }

// export async function landLordSendApplicationToAgent(
//   dispatch: AppDispatch,
//   getState: () => RootState,
//   propertyId: string,
//   applicationId: string
// ): Promise<void> {
//   const status = getApplicationStatus(getState, propertyId, applicationId);

//   if (status === TenantApplicationStatus.LANDLORD_APPROVED) {
//     await dispatch(sendApprovedApplicationsToAgentAsync()).unwrap();
//     return;
//   }

//   if (status === TenantApplicationStatus.FINAL_APPROVED) {
//     await dispatch(sendFinalApprovedApplicationsToAgentAsync()).unwrap();
//     return;
//   }
// }
