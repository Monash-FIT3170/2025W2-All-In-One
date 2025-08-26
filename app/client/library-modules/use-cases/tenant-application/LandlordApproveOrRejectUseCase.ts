// app/client/library-modules/use-cases/tenant-application/LandlordApproveOrRejectUseCase.ts
import { AppDispatch } from "/app/client/store";
import {
  landlordApproveTenantApplicationAsync,
  landlordRejectTenantApplicationAsync,
} from "/app/client/ui-modules/tenant-selection/state/reducers/tenant-selection-slice";
import { RootState } from "/app/client/store";
import { selectApplicationsForProperty } from "/app/client/ui-modules/tenant-selection/state/reducers/tenant-selection-slice";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";

function getApplicationStatus(
  getState: () => RootState,
  propertyId: string,
  applicationId: string
): TenantApplicationStatus | undefined {
  const apps = selectApplicationsForProperty(getState(), propertyId);
  return apps.find(a => a.id === applicationId)?.status;
}

export async function landlordApproveApplication(
  dispatch: AppDispatch,
  getState: () => RootState,
  propertyId: string,
  applicationId: string
): Promise<void> {
  const status = getApplicationStatus(getState, propertyId, applicationId);

  if (status === TenantApplicationStatus.UNDETERMINED) {
    await dispatch(landlordApproveTenantApplicationAsync(applicationId)).unwrap();
    return;
  }

}
export async function landlordRejectApplication(
  dispatch: AppDispatch,
  getState: () => RootState,
  propertyId: string,
  applicationId: string
): Promise<void> {
  const status = getApplicationStatus(getState, propertyId, applicationId);

  if (status === TenantApplicationStatus.UNDETERMINED) {
    await dispatch(landlordRejectTenantApplicationAsync(applicationId)).unwrap();
    return;
  }

}

