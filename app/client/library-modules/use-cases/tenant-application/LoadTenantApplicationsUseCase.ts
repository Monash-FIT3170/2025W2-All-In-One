import { getTenantApplicationsByPropertyId } from "/app/client/library-modules/domain-models/tenant-application/repositories/tenant-application-repository";
import { TenantApplication } from "/app/client/library-modules/domain-models/tenant-application/TenantApplication"

export interface LoadTenantApplicationsResult {
  propertyId: string;
  applications: TenantApplication[];
}
// Load tenant applications for a property that is listed, tenant selection or tenant approval
export class LoadTenantApplicationsUseCase {

  async execute(propertyId: string): Promise<LoadTenantApplicationsResult> {
    if (!propertyId) {
      throw new Error('Property ID is required to load tenant applications');
    }

    // Load applications from repository
    const domainApplications = await getTenantApplicationsByPropertyId(propertyId);

    return {
      propertyId,
      applications: domainApplications
    };
  }
}