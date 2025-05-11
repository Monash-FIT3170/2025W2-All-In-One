import { ApiListing } from "/app/client/library-modules/apis/property-listings/models/ApiListing";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

export async function apiGetListingForProperty(propertyId: string): Promise<ApiListing> {
  const fetchedListing = await Meteor.callAsync(MeteorMethodIdentifier.LISTING_GET_FOR_PROPERTY, propertyId);

  return fetchedListing
}