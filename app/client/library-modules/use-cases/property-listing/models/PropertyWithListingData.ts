
export type PropertyWithListingData = {
  propertyId: string;
  landlordId: string;
  streetnumber: string;
  streetname: string;
  suburb: string;
  province: string;
  postcode: string;
  pricePerMonth: number;
  propertyStatus: string;
  description: string;
  summaryDescription: string;
  bathrooms: number;
  bedrooms: number;
  parking: number;
  features: string[];
  type: string;
  area?: number;
  image_urls: string[];
  listing_status: string;
  inspections: {
    start_time: Date;
    end_time: Date;
  }[];
}