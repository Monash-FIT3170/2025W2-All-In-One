import { PropertyPriceCollection } from "../../database/property/property-collections";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { PropertyPriceInsertData } from "/app/shared/api-models/property-price/PropertyPriceInsertData";
const insertPropertyPriceForProperty = {
  [MeteorMethodIdentifier.PROPERTY_PRICE_INSERT]: async (
    propertyPriceData: PropertyPriceInsertData
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
