import {Tenant} from "../../Tenant";
import { ApiTenant } from "/app/shared/api-models/user/api-roles/ApiTenant";

export function mapApiTenantToTenant(tenant: ApiTenant): Tenant {
  return {
    tenantId: tenant.tenantId, 
    userAccountId: tenant.userAccountId,
    firstName: tenant.firstName,
    lastName: tenant.lastName,
    email: tenant.email,
    createdAt: tenant.createdAt.toISOString(),
  };
}