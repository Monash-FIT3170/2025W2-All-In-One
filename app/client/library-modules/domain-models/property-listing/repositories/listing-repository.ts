import { apiGetListingForProperty, apiSubmitDraftListing, apiGetAllListedListings, apiInsertPropertyListing } from "../../../apis/property-listing/listing-api";
import { Listing } from "/app/client/library-modules/domain-models/property-listing/Listing";
import { mapApiListingToListing } from "./mappers/listing-mapper";
import { ApiListing } from "/app/shared/api-models/property-listing/ApiListing";
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";


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

export async function insertPropertyListing(
  propertyId: string,
  imageUrls: string[],
  status: ListingStatus,
): Promise<string> {
  return await apiInsertPropertyListing(propertyId, imageUrls, status);
}