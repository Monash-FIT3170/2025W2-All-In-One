export type PropertyWithListingData = {
  propertyId: string;
  landlordId: string;
  streetnumber: string;
  streetname: string;
  suburb: string;
  province: string;
  postcode: string;
  apartment_number?: string;
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
  agentId: string;
  tenantId: string;
  image_urls: string[];
  locationLatitude: number;
  locationLongitude: number;
  listing_status: string;
  lease_term: string;
  propertyListingInspections: {
    start_time: Date;
    end_time: Date;
  }[];
}