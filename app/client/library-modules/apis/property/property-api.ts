import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { PropertyInsertData } from "/app/shared/api-models/property/PropertyInsertData";
import { Property } from "../../domain-models/property/Property";
import { PropertyUpdateData } from "/app/shared/api-models/property/PropertyUpdateData";

export async function apiGetPropertyById(id: string): Promise<ApiProperty> {
  const fetchedProperty = await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET, id);

  return fetchedProperty;
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
