import { ApiListing } from "/app/shared/api-models/property-listing/ApiListing";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

export async function apiGetListingForProperty(propertyId: string): Promise<ApiListing> {
  const fetchedListing = await Meteor.callAsync(MeteorMethodIdentifier.LISTING_GET_FOR_PROPERTY, propertyId);

  return fetchedListing
}