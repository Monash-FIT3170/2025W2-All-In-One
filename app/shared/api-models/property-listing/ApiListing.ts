
export type ApiListing = {
  property_id: string;
  image_urls: string[];
  listing_status: string;
  inspections: {
    start_time: string;
    end_time: string;
  }[];
};
