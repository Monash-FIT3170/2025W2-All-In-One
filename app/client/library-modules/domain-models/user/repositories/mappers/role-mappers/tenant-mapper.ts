import {Tenant} from "../../../Tenant";
import { ApiTenant } from "/app/shared/api-models/user/api-roles/ApiTenant";

export function mapApiTenantToTenant(tenant: ApiTenant): Tenant {
  return {
    tenantId: tenant.tenantId, 
    userId: tenant.userId,
    firstName: tenant.firstName,
    lastName: tenant.lastName,
    email: tenant.email,
    createdAt: tenant.createdAt.toISOString(),
  };
}