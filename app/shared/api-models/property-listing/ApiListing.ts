
export type ApiListing = {
  property_id: string;
  image_urls: string[];
  listing_status: string;
  lease_term: string;
  startlease_date: Date;
  endlease_date: Date;
  propertyListingInspections: {
    start_time: Date;
    end_time: Date;
    tenant_ids: string[];
  }[];
};
