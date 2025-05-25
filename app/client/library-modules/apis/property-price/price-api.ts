import { PropertyPriceInsertData } from "/app/shared/api-models/property-price/PropertyPriceInsertData";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

export const apiPropertyInsertPrice = async (propertyId: string, price: number): Promise<string> => {
  const priceData: PropertyPriceInsertData = {
    property_id: propertyId,
    price_per_month: price,
    date_set: new Date(),
  };

  const insertedPrice: string = await Meteor.callAsync(
    MeteorMethodIdentifier.PROPERTY_PRICE_INSERT,
    priceData
  );

  return insertedPrice;
}