import { apiGetPropertyById } from "/app/client/library-modules/apis/property/property-api";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { mapApiPropertyToProperty } from "./mappers/property-mapper";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { apiGetPropertyStatusId } from "/app/client/library-modules/apis/property/property-api";

export async function getPropertyById(id: string): Promise<Property> {
  const apiProperty = await apiGetPropertyById(id);
  const mappedProperty = mapApiPropertyToProperty(apiProperty);

  return mappedProperty;
}

export async function getPropertyStatusId(name: PropertyStatus): Promise<string> {
  return await apiGetPropertyStatusId(name);
}