
export type Listing = {
  image_urls: string[];
  inspections: {
    start_time: Date;
    end_time: Date;
  }[];
}