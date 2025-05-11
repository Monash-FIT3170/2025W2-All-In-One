
export type ApiListing = {
  property_id: string;
  image_urls: string[];
  inspections: {
    start_time: Date;
    end_time: Date;
  }[];
}