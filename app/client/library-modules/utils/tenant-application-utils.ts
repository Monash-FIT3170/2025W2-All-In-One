import { Role } from '/app/shared/user-role-identifier';
import { TenantApplicationStatus } from '/app/shared/api-models/tenant-application/TenantApplicationStatus';

export function canResetApplication(userRole: Role, status: TenantApplicationStatus): boolean {
  if (userRole === Role.AGENT) {
    return status === TenantApplicationStatus.ACCEPTED ||
           status === TenantApplicationStatus.REJECTED ||
           status === TenantApplicationStatus.BACKGROUND_CHECK_PASSED ||
           status === TenantApplicationStatus.BACKGROUND_CHECK_FAILED;
  }

  if (userRole === Role.LANDLORD) {
    return status === TenantApplicationStatus.LANDLORD_APPROVED ||
           status === TenantApplicationStatus.LANDLORD_REJECTED ||
           status === TenantApplicationStatus.FINAL_APPROVED ||
           status === TenantApplicationStatus.FINAL_REJECTED;
  }

  return false;
}