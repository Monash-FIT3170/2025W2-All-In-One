
export type Listing = {
  image_urls: string[];
  listing_status: string;
  inspections: {
    start_time: string;
    end_time: string;
  }[];
}