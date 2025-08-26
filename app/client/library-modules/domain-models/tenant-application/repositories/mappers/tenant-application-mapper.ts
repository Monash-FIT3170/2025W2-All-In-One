import { TenantApplication } from "../../TenantApplication";
import { ApiTenantApplication } from "../../../../../../shared/api-models/tenant-application/ApiTenantApplication";

export function mapApiTenantApplicationToTenantApplication(tenantApplication: ApiTenantApplication): TenantApplication {
  return {
    id: tenantApplication.id,
    propertyId: tenantApplication.propertyId,
    applicantName: tenantApplication.applicantName,
    status: tenantApplication.status,
    step: tenantApplication.step,
    createdAt: tenantApplication.createdAt,
    updatedAt: tenantApplication.updatedAt,
    agentId: tenantApplication.agentId,
    landlordId: tenantApplication.landlordId,
    taskId: tenantApplication.taskId,
  }
}
