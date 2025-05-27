import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { PropertyFeatureDocument } from "/app/server/database/property/models/PropertyFeatureDocument";

export async function apiGetAllPropertyFeatures(): Promise<PropertyFeatureDocument[]> {
  return await Meteor.callAsync(MeteorMethodIdentifier.PROPERTY_FEATURES_GET_ALL);
}
