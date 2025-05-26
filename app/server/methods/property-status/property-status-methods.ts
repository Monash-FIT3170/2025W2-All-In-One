import {
  PropertyStatusCollection,
} from "../../database/property/property-collections";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { PropertyStatus } from "../../../shared/api-models/property/PropertyStatus";

const propertyGetStatusMethod = {
  [MeteorMethodIdentifier.PROPERTY_STATUS_GET]: async (
    name: PropertyStatus
  ): Promise<string> => {
    const document = await PropertyStatusCollection.findOneAsync({name: name})
    if (!document){
      throw new Meteor.Error("not-found",`PropertyStatus ${name} not found`);
    }
    return document?._id;
  },
};

Meteor.methods({
  ...propertyGetStatusMethod,
});
