import { apiGetListingForProperty } from "/app/client/library-modules/apis/property-listings/listing-api";
import { Listing } from "/app/client/library-modules/domain-models/property-listing/Listing";
import { mapApiListingToListing } from "/app/client/library-modules/domain-models/property-listing/repositories/listing-mapper";

export async function getListingForProperty(propertyId: string): Promise<Listing> {
  const apiListing = await apiGetListingForProperty(propertyId);
  const mappedListing = mapApiListingToListing(apiListing);

  return mappedListing;
}