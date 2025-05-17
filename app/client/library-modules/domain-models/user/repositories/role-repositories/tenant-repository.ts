import { mapApiTenantToTenant } from "../mappers/role-mappers/tenant-mapper";
import { apiGetTenant } from "../../../../apis/user/user-role-api";
import { Tenant } from "../../Tenant";

export async function getTenantById(id: string): Promise<Tenant> {
  const apiTenant = await apiGetTenant(id);
  const mappedTenant = mapApiTenantToTenant(apiTenant);

  return mappedTenant;
}