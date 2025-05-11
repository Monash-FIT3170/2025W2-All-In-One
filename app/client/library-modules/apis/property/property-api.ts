import { ApiProperty } from "/app/client/library-modules/apis/property/models/ApiProperty";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

export async function apiGetPropertyById(id: string): Promise<ApiProperty> {
  const fetchedProperty = await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_GET, id);

  return fetchedProperty;
}
