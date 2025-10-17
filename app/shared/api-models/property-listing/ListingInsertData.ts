export type ListingInsertData = {
  property_id: string;
  image_urls: string[];
  listing_status_id: string;
  inspection_ids: string[];
  startlease_date: Date;
  endlease_date: Date;
  lease_term: string;
}

export type ApiInsertListingPayload = {
  property_id: string;
  image_urls: string[];
  inspection_ids: string[];
  startlease_date: Date;
  endlease_date: Date;
  lease_term: string;
}