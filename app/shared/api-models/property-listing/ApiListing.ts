
export type ApiListing = {
  property_id: string;
  image_urls: string[];
  listing_status: string;
  propertyListingInspections: {
    start_time: Date;
    end_time: Date;
    tenant_ids: string[];
  }[];
};
