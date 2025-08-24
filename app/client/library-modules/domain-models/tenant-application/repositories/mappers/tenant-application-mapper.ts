import { TenantApplication } from "../../TenantApplication";
import { ApiTenantApplication } from "/app/shared/api-models/tenant/ApiTenantApplication";

export function mapApiTenantApplicationToTenantApplication(apiTenantApplication: ApiTenantApplication): TenantApplication {
  return {
    id: apiTenantApplication.id,
    propertyId: apiTenantApplication.propertyId,
    applicantName: apiTenantApplication.applicantName,
    status: apiTenantApplication.status,
    step: apiTenantApplication.step,
    createdAt: apiTenantApplication.createdAt,
    updatedAt: apiTenantApplication.updatedAt,
    agentId: apiTenantApplication.agentId,
    landlordId: apiTenantApplication.landlordId,
    taskId: apiTenantApplication.taskId,
  }
}
