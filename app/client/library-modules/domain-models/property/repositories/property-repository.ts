import {
  apiGetAllProperties,
  apiGetPropertyStatusId,
  apiGetLandlordDashboard,
  apiGetPropertyById,
  apiInsertProperty,
  apiGetPropertyByTenantId,
  apiGetPropertyByAgentId,
  apiGetAllPropertiesByLandlordId,
} from "/app/client/library-modules/apis/property/property-api";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { mapApiPropertyToProperty } from "./mappers/property-mapper";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { PropertyInsertData } from "/app/shared/api-models/property/PropertyInsertData";
import { ApiLandlordDashboard } from "/app/shared/api-models/landlord/ApiLandlordDashboard";

export async function getPropertyById(id: string): Promise<Property> {
    const apiProperty = await apiGetPropertyById(id);
    const mappedProperty = mapApiPropertyToProperty(apiProperty);

    return mappedProperty;
}

export async function getPropertyStatusId(
    name: PropertyStatus
): Promise<string> {
    return await apiGetPropertyStatusId(name);
export async function getPropertyStatusId(
  name: PropertyStatus
): Promise<string> {
  return await apiGetPropertyStatusId(name);
}

export async function insertProperty(
    property: PropertyInsertData
): Promise<string> {
    return await apiInsertProperty(property);
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

export async function getPropertyByTenantId(
    tenantId: string
): Promise<Property> {
    const apiProperty = await apiGetPropertyByTenantId(tenantId);
    const mappedProperty = mapApiPropertyToProperty(apiProperty);
    return mappedProperty;
export async function getPropertyByTenantId(
  tenantId: string
): Promise<Property> {
  const apiProperty = await apiGetPropertyByTenantId(tenantId);
  const mappedProperty = mapApiPropertyToProperty(apiProperty);
  return mappedProperty;
}

export async function getPropertyByAgentId(
    agentId: string
): Promise<Property[]> {
    const apiProperties = await apiGetPropertyByAgentId(agentId);
    const mappedProperties = apiProperties.map(mapApiPropertyToProperty);
    return mappedProperties;
export async function getPropertyByAgentId(
  agentId: string
): Promise<Property[]> {
  const apiProperties = await apiGetPropertyByAgentId(agentId);
  const mappedProperties = apiProperties.map(mapApiPropertyToProperty);
  return mappedProperties;
}

export async function getAllPropertiesByLandlordId(
    landlordId: string
): Promise<Property[]> {
    const apiProperties = await apiGetAllPropertiesByLandlordId(landlordId);
    const mappedProperties = apiProperties.map(mapApiPropertyToProperty);
    return mappedProperties;
export async function getAllPropertiesByLandlordId(
  landlordId: string
): Promise<Property[]> {
  const apiProperties = await apiGetAllPropertiesByLandlordId(landlordId);
  const mappedProperties = apiProperties.map(mapApiPropertyToProperty);
  return mappedProperties;
}

export async function searchProperties(query: string): Promise<Property[]> {
    const apiProperties = await apiSearchPropertyByQuery(query);
    return apiProperties.map(mapApiPropertyToProperty);
}


export async function fetchLandlordDashboardData(
  landlordId: string
): Promise<ApiLandlordDashboard> {
  return await apiGetLandlordDashboard(landlordId);
}

export const landlordPropertyRepository = {
  fetchLandlordDashboardData,
};
