import { apiGetListingForProperty, apiGetAllListedListings } from "../../../apis/property-listing/listing-api";
import { Listing } from "/app/client/library-modules/domain-models/property-listing/Listing";
import { mapApiListingToListing } from "./mappers/listing-mapper";


export async function getListingByPropertyId(id: string): Promise<Listing> {
  const apiListing = await apiGetListingForProperty(id);
  const mappedListing = mapApiListingToListing(apiListing);

  return mappedListing;
}

export async function getAllListedListings(): Promise<{ property_id: string, listing: Listing }[]> {
  const apiListings = await apiGetAllListedListings();
  return apiListings.map(apiListing => ({
    property_id: apiListing.property_id,
    listing: mapApiListingToListing(apiListing),
  }));
}