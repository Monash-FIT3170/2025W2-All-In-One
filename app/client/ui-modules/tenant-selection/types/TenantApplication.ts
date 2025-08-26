import { TenantApplication as DomainTenantApplication } from '/app/client/library-modules/domain-models/tenant-application/TenantApplication';

export type TenantApplication = {
  id: string;
  name: string;
  status: DomainTenantApplication['status'];
  step?: number; //Track which step the tenant application is on
}
