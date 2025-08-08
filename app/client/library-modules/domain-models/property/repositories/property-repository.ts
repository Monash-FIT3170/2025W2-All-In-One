import {
  apiGetPropertyById,
  apiGetPropertyStatusId,
  apiInsertProperty,
  apiGetPropertyByTenantId,
  apiGetLandlordDashboard,
} from "/app/client/library-modules/apis/property/property-api";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { mapApiPropertyToProperty } from "./mappers/property-mapper";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { ApiLandlordDashboard } from "/app/shared/api-models/landlord/ApiLandlordDashboard";
import { PropertyInsertData } from "/app/shared/api-models/property/PropertyInsertData";

export async function getPropertyById(id: string): Promise<Property> {
  const apiProperty = await apiGetPropertyById(id);
  const mappedProperty = mapApiPropertyToProperty(apiProperty);

  return mappedProperty;
}

export async function getPropertyStatusId(
  name: PropertyStatus
): Promise<string> {
  return await apiGetPropertyStatusId(name);
}

export async function insertProperty(
  property: PropertyInsertData
): Promise<string> {
  return await apiInsertProperty(property);
}

export async function getPropertyByTenantId(
  tenantId: string
): Promise<Property> {
  const apiProperty = await apiGetPropertyByTenantId(tenantId);
  const mappedProperty = mapApiPropertyToProperty(apiProperty);
  return mappedProperty;
}

export async function fetchLandlordDashboardData(
  landlordId: string
): Promise<ApiLandlordDashboard> {
  return await apiGetLandlordDashboard(landlordId);
}

export const landlordPropertyRepository = {
  fetchLandlordDashboardData,
};
