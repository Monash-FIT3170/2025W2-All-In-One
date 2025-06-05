import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { PropertyInsertData } from "/app/shared/api-models/property/PropertyInsertData";
import { PropertyUpdateData } from "/app/shared/api-models/property/PropertyUpdateData";

export async function apiGetPropertyById(id: string): Promise<ApiProperty> {
  try {
    const fetchedProperty = await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET, id);
    return fetchedProperty;

  } catch (error) {
    console.error(`Error fetching property with ID ${id}:`, error);
    throw error;
  }
}

export async function apiGetPropertyStatusId(name: PropertyStatus): Promise<string> {
  return await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_STATUS_GET, name);
}

export async function apiInsertProperty(property: PropertyInsertData): Promise<string> {
  return await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_INSERT, property);
}

export async function apiUpdatePropertyData(updatedProperty: PropertyUpdateData): Promise<string> {
  return await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_DATA_UPDATE, updatedProperty);
}

export async function apiGetAllProperties(): Promise<ApiProperty[]> {
  const fetchedProperties: ApiProperty[] = await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET_ALL);
  return fetchedProperties;
}

export async function apiGetPropertyByTenantId(tenantId: string): Promise<ApiProperty> {
  return await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET_BY_TENANT_ID, tenantId);
}

export async function apiGetPropertyByAgentId(agentId: string): Promise<ApiProperty> {
  return await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET_BY_AGENT_ID, agentId);
}
