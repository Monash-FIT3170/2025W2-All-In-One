import {
  apiGetTenantApplicationsByPropertyId,
  apiGetTenantApplicationsByLandlordId,
  apiInsertTenantApplication,
  apiUpdateTenantApplicationStatuses,
} from "/app/client/library-modules/apis/tenant-application/tenant-application";
import { TenantApplication, TenantApplicationInsertData } from "../TenantApplication";
import { mapApiTenantApplicationToTenantApplication } from "./mappers/tenant-application-mapper";
import { TenantApplicationStatus } from "../../../../../shared/api-models/tenant-application/TenantApplicationStatus";

// Get tenant applications for a specific property
export async function getTenantApplicationsByPropertyId(propertyId: string): Promise<TenantApplication[]> {
  const apiApplications = await apiGetTenantApplicationsByPropertyId(propertyId);
  const mappedApplications = apiApplications.map(mapApiTenantApplicationToTenantApplication);
  return mappedApplications;
}

// Get tenant applications for a specific landlord
export async function getTenantApplicationsByLandlordId(landlordId: string): Promise<TenantApplication[]> {
  const apiApplications = await apiGetTenantApplicationsByLandlordId(landlordId);
  const mappedApplications = apiApplications.map(mapApiTenantApplicationToTenantApplication);
  return mappedApplications;
}

// Insert a new tenant application
export async function insertTenantApplication(applicationData: TenantApplicationInsertData): Promise<string> {
  return await apiInsertTenantApplication(applicationData);
}

//Update tenant application status
export async function updateTenantApplicationStatus(
  applicationIds: string[],
  status: TenantApplicationStatus,
  step: number,
  taskId?: string
): Promise<void> {
  await apiUpdateTenantApplicationStatuses(applicationIds, status, step, taskId);
}
