export type ListingInsertData = {
  property_id: string;
  image_urls: string[];
  listing_status_id: string;
  inspection_ids: string[];
}

export type IncompleteListingInsertData = {
  property_id: string;
  image_urls: string[];
  inspection_ids: string[]; 
}