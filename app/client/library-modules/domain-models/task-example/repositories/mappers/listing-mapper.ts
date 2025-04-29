import { Listing } from "../../Listing";
import { ApiListing } from "/app/client/library-modules/apis/listing/ApiListing";

export function mapApiListingsToListing(listings: ApiListing[]): Listing[] {
  return listings.map((listing) => {
    return {
      id: listing.listingId,
      title: listing.title,
      description: listing.description
    }
  })
}