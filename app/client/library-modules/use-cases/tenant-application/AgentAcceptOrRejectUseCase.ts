import { RootState } from "/app/client/store";
import { AppDispatch } from "/app/client/store";
import {
  acceptTenantApplicationAsync,
  rejectTenantApplicationAsync,
  agentBackgroundCheckPassedAsync,
  agentBackgroundCheckFailedAsync,
  selectApplicationsForProperty,
} from "/app/client/ui-modules/tenant-selection/state/reducers/tenant-selection-slice";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";

export class AgentAcceptOrBackgroundCheckUseCase {
  constructor(
    private readonly dispatch: AppDispatch,
    private readonly getStep: () => number
  ) {}

  private getStep(propertyId: string, applicationId: string): Integer {
    const apps = selectApplicationsForProperty(this.getStep(), propertyId)
    return apps.find(a => a.id === applicationId)?.step;

  }
  private getStatus(propertyId: string, applicationId: string): TenantApplicationStatus | undefined {
    const apps = selectApplicationsForProperty(this.getState(), propertyId);
    return apps.find(a => a.id === applicationId)?.status;
  }

  async accept(propertyId: string, applicationId: string): Promise<void> {
    const status = this.getStatus(propertyId, applicationId);
    if (status === TenantApplicationStatus.UNDETERMINED) {
      await this.dispatch(acceptTenantApplicationAsync(applicationId)).unwrap();
      return;
    }
    if (status === TenantApplicationStatus.BACKGROUND_CHECK_PENDING) {
      await this.dispatch(agentBackgroundCheckPassedAsync(applicationId)).unwrap();
      return;
    }
    // no-op for other statuses
  }

  async reject(propertyId: string, applicationId: string): Promise<void> {
    const status = this.getStatus(propertyId, applicationId);
    if (status === TenantApplicationStatus.UNDETERMINED) {
      await this.dispatch(rejectTenantApplicationAsync(applicationId)).unwrap();
      return;
    }
    if (status === TenantApplicationStatus.BACKGROUND_CHECK_PENDING) {
      await this.dispatch(agentBackgroundCheckFailedAsync(applicationId)).unwrap();
      return;
    }
    // no-op for other statuses
  }
}