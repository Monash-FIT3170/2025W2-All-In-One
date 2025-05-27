import { ApiInsertPropertyPricePayload } from "/app/shared/api-models/property-price/ApiInsertPropertyPricePayload";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

export const apiPropertyInsertPrice = async (
  propertyId: string,
  price: number
): Promise<string> => {
  const priceData: ApiInsertPropertyPricePayload = {
    property_id: propertyId,
    price_per_month: price,
    date_set: new Date(),
  };

  const insertedPrice: string = await Meteor.callAsync(
    MeteorMethodIdentifier.PROPERTY_PRICE_INSERT,
    priceData
  );

  return insertedPrice;
};
