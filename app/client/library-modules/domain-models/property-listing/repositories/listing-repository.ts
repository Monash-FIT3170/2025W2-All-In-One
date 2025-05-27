import { apiGetListingForProperty, apiSubmitDraftListing, apiGetAllListedListings } from "../../../apis/property-listing/listing-api";
import { Listing } from "/app/client/library-modules/domain-models/property-listing/Listing";
import { mapApiListingToListing } from "./mappers/listing-mapper";
import { ApiListing } from "/app/shared/api-models/property-listing/ApiListing";


export async function getListingByPropertyId(id: string): Promise<Listing> {
  const apiListing = await apiGetListingForProperty(id);
  const mappedListing = mapApiListingToListing(apiListing);

  return mappedListing;
}

export async function submitDraftListing(propertyId: string): Promise<void> {
  await apiSubmitDraftListing(propertyId);
}


export async function getAllListedListings(): Promise<{ apiListing: ApiListing }[]> {
  const apiListings = await apiGetAllListedListings();
  return apiListings.map(apiListing => ({ apiListing }));
}