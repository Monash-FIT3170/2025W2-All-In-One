import { Tenant } from "../../Tenant";
import { ApiTenant } from "/app/shared/api-models/user/api-roles/ApiTenant";

export function mapApiTenantToTenant(tenant: ApiTenant): Tenant {
    return {
        tenantId: tenant.tenantId,
        userAccountId: tenant.userAccountId,
        tasks: tenant.tasks,
        createdAt: tenant.createdAt.toISOString(),
    };
}
