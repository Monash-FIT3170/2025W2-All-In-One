import { Listing } from "../Listing";
import { apiGetAllListings } from "../../../apis/listing/listing-api";
import { mapApiListingsToListing } from "./mappers/listing-mapper";

export async function repoGetAllListings(): Promise<Listing[]> {
  const dbListings = await apiGetAllListings();
  const mappedListings = mapApiListingsToListing(dbListings)

  return mappedListings;
}