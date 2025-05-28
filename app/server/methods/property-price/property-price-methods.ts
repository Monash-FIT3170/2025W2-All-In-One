import { PropertyPriceCollection } from "../../database/property/property-collections";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiInsertPropertyPricePayload } from "/app/shared/api-models/property-price/ApiInsertPropertyPricePayload";
const insertPropertyPriceForProperty = {
  [MeteorMethodIdentifier.PROPERTY_PRICE_INSERT]: async (
    propertyPriceData: ApiInsertPropertyPricePayload
  ): Promise<string> => {
    const propertyPrice = await PropertyPriceCollection.insertAsync(
      propertyPriceData
    );
    return propertyPrice;
  },
};

Meteor.methods({
  ...insertPropertyPriceForProperty,
});
