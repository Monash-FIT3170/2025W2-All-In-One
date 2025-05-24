import { ApiListing } from "/app/shared/api-models/property-listing/ApiListing";
import { Listing } from "/app/client/library-modules/domain-models/property-listing/Listing";

export function mapApiListingToListing(data: ApiListing): Listing {
  return {
    image_urls: data.image_urls,
    listing_status: data.listing_status,
    inspections: data.inspections
  }
}