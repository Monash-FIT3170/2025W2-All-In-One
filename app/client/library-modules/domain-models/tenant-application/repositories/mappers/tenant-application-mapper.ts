import { TenantApplication } from "../../TenantApplication";
import { ApiTenantApplication } from "../../../../../../shared/api-models/tenant-application/ApiTenantApplication";
import { TenantApplicationDocument } from "../../../../../../server/database/tenant/models/TenantApplicationDocument";
import { TenantApplicationStatus } from "../../../../../../shared/api-models/tenant-application/TenantApplicationStatus";

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
    linkedTaskId: app.linkedTaskId,
  }
}

export function mapTenantApplicationDocumentToTenantApplication(appDoc: TenantApplicationDocument): TenantApplication {
  return {
    id: appDoc._id,
    propertyId: appDoc.propertyId,
    applicantName: appDoc.applicantName,
    status: appDoc.status as TenantApplicationStatus,
    step: appDoc.step,
    createdAt: appDoc.createdAt.toISOString(),
    updatedAt: appDoc.updatedAt.toISOString(),
    agentId: appDoc.agentId,
    landlordId: appDoc.landlordId,
    tenantUserId: appDoc.tenantUserId,
    taskId: appDoc.taskId,
    linkedTaskId: appDoc.linkedTaskId,
  };
}