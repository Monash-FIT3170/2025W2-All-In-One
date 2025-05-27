import { Meteor } from "meteor/meteor";
import { PropertyFeatureCollection } from "/app/server/database/property/property-collections";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { PropertyFeatureDocument } from "/app/server/database/property/models/PropertyFeatureDocument";

const getAllFeaturesMethod = {
  [MeteorMethodIdentifier.PROPERTY_FEATURES_GET_ALL]: async (): Promise<PropertyFeatureDocument[]> => {
    return await PropertyFeatureCollection.find().fetchAsync();
  },
};

Meteor.methods({
  ...getAllFeaturesMethod,
});
