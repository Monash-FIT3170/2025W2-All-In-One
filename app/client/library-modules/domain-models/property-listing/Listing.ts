
export type Listing = {
  image_urls: string[];
  listing_status: string;
  propertyInspections: {
    start_time: Date;
    end_time: Date;
  }[];
}