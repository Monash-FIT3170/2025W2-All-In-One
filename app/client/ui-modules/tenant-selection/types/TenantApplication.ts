import { TenantApplication as DomainTenantApplication } from '/app/client/library-modules/domain-models/tenant-application/TenantApplication';

// UI-specific type that extends the domain model for UI needs
export type TenantApplication = {
  id: string;
  name: string; // Maps to applicantName in domain model
  status: DomainTenantApplication['status'];
  step?: number; //Track which step the tenant application is on
}
