
export type ListingDocument = {
  _id: string;
  property_id: string;
  image_urls: string[];
  listing_status_id: string;
  inspection_ids: string[];
  startlease_date: Date;
  endlease_date: Date;
  lease_term: string;
}