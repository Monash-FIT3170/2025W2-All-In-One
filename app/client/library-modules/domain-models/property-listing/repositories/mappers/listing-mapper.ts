import { ApiListing } from "/app/shared/api-models/property-listing/ApiListing";
import { Listing } from "/app/client/library-modules/domain-models/property-listing/Listing";
import { getFormattedDateStringFromDate, getFormattedTimeStringFromDate } from "/app/client/library-modules/utils/date-utils";

export function mapApiListingToListing(data: ApiListing): Listing {
  return {
    image_urls: data.image_urls,
    listing_status: data.listing_status,
    inspections: data.inspections.map(inspection => ({
      start_time: typeof inspection.start_time === 'string'
        ? inspection.start_time
        : getFormattedDateStringFromDate(inspection.start_time as Date) + ' ' + getFormattedTimeStringFromDate(inspection.start_time as Date),
      end_time: typeof inspection.end_time === 'string'
        ? inspection.end_time
        : getFormattedDateStringFromDate(inspection.end_time as Date) + ' ' + getFormattedTimeStringFromDate(inspection.end_time as Date)
    }))
  }
}