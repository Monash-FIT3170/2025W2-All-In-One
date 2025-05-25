import { apiGetListingForProperty, apiSubmitDraftListing } from "../../../apis/property-listing/listing-api";
import { Listing } from "/app/client/library-modules/domain-models/property-listing/Listing";
import { mapApiListingToListing } from "./mappers/listing-mapper";

export async function getListingByPropertyId(id: string): Promise<Listing> {
  const apiListing = await apiGetListingForProperty(id);
  const mappedListing = mapApiListingToListing(apiListing);

  return mappedListing;
}

export async function submitDraftListing(propertyId: string): Promise<void> {
  await apiSubmitDraftListing(propertyId);
}
