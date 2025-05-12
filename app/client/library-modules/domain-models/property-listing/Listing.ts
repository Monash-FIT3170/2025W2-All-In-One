
export type Listing = {
  image_urls: string[];
  listing_status: string;
  inspections: {
    start_time: Date;
    end_time: Date;
  }[];
}