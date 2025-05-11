import { apiGetListingForProperty } from "../../../apis/property-listing/listing-api";
import { Listing } from "/app/client/library-modules/domain-models/property-listing/Listing";
import { mapApiListingToListing } from "./mappers/listing-mapper";

export async function getListingDataForProperty(propertyId: string): Promise<Listing> {
  const apiListing = await apiGetListingForProperty(propertyId);
  const mappedListing = mapApiListingToListing(apiListing);

  return mappedListing;
}