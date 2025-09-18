
export type Listing = {
  image_urls: string[];
  listing_status: string;
  lease_term: string;
  propertyListingInspections: {
    start_time: Date;
    end_time: Date;
    tenant_ids: string[];
  }[];
}