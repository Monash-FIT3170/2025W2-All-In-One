
export type ApiListing = {
  property_id: string;
  image_urls: string[];
  listing_status: string;
  inspections: {
    start_time: Date;
    end_time: Date;
  }[];
}