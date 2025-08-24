import { TenantApplication } from "../../TenantApplication";
import { ApiTenantApplication } from "/app/shared/api-models/tenant/ApiTenantApplication";

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
