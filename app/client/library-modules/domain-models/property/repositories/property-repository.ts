import { apiGetAllProperties, apiGetPropertyById, apiInsertProperty, apiGetPropertyByTenantId, apiInsertUserProperty } from "/app/client/library-modules/apis/property/property-api";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { mapApiPropertyToProperty } from "./mappers/property-mapper";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { apiGetPropertyStatusId } from "/app/client/library-modules/apis/property/property-api";
import { PropertyInsertData } from "/app/shared/api-models/property/PropertyInsertData";
import { Role } from "/app/shared/user-role-identifier";

export async function getPropertyById(id: string): Promise<Property> {
  const apiProperty = await apiGetPropertyById(id);
  const mappedProperty = mapApiPropertyToProperty(apiProperty);

  return mappedProperty;
}

export async function getPropertyStatusId(name: PropertyStatus): Promise<string> {
  return await apiGetPropertyStatusId(name);
}

export async function insertProperty(property: PropertyInsertData): Promise<string> {
  const propertyId: string = await apiInsertProperty(property);
  await apiInsertUserProperty(propertyId, property.agent_id, Role.AGENT);
  await apiInsertUserProperty(propertyId, property.landlord_id, Role.LANDLORD);
  return propertyId;
}

export async function getAllProperties(): Promise<Property[]> {
  const apiProperties = await apiGetAllProperties();
  const mappedProperties = apiProperties.map(mapApiPropertyToProperty);

  return mappedProperties;
}

export async function getPropertyByTenantId(tenantId: string): Promise<Property> {
  const apiProperty = await apiGetPropertyByTenantId(tenantId);
  const mappedProperty = mapApiPropertyToProperty(apiProperty);
  return mappedProperty;
}