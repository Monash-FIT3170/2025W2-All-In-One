import { apiGetAllProperties, apiGetPropertyById, apiInsertProperty, apiGetPropertyByTenantId } from "/app/client/library-modules/apis/property/property-api";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { mapApiPropertyToProperty } from "./mappers/property-mapper";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import {
  apiGetPropertyStatusId,
  apiGetLandlordAverageRent,
  apiGetLandlordIncome,
  apiGetLandlordOccupancyRate,
  apiGetLandlordPropertyCount,
  apiGetLandlordStatusCounts,
} from "/app/client/library-modules/apis/property/property-api";
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

export async function getAllProperties(): Promise<Property[]> {
  const apiProperties = await apiGetAllProperties();
  const mappedProperties = apiProperties.map(mapApiPropertyToProperty);

  return mappedProperties;
}

export async function getLandlordPropertyCount(
  landlordId: string
): Promise<number> {
  return await apiGetLandlordPropertyCount(landlordId);
}
export async function getLandlordStatusCounts(
  landlordId: string
): Promise<{ occupied: number; vacant: number }> {
  return await apiGetLandlordStatusCounts(landlordId);
}
export async function getLandlordIncome(
  landlordId: string
): Promise<{ weekly: number; monthly: number }> {
  return await apiGetLandlordIncome(landlordId);
}
export async function getLandlordOccupancyRate(
  landlordId: string
): Promise<number> {
  return await apiGetLandlordOccupancyRate(landlordId);
}
export async function getLandlordAverageRent(
  landlordId: string
): Promise<{ occupiedCount: number; rent: number }> {
  return await apiGetLandlordAverageRent(landlordId);
}

export async function getPropertyByTenantId(tenantId: string): Promise<Property> {
  const apiProperty = await apiGetPropertyByTenantId(tenantId);
  const mappedProperty = mapApiPropertyToProperty(apiProperty);
  return mappedProperty;
}

