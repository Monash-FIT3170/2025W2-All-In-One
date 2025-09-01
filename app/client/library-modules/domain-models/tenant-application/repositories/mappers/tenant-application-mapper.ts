import { TenantApplication } from "../../TenantApplication";
import { ApiTenantApplication } from "../../../../../../shared/api-models/tenant-application/ApiTenantApplication";

export function mapApiTenantApplicationToTenantApplication(app: ApiTenantApplication): TenantApplication {
  return {
    id: app.id,
    propertyId: app.propertyId,
    applicantName: app.applicantName,
    status: app.status,
    step: app.step,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    agentId: app.agentId,
    landlordId: app.landlordId,
    tenantUserId: app.tenantUserId,
    taskId: app.taskId,
  }
}
