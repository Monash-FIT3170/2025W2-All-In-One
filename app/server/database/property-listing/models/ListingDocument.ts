
export type ListingDocument = {
  _id: string;
  property_id: string;
  image_urls: string[];
  listing_status_id: string;
  inspection_ids: string[];
  // To add listing_leaseterm
}