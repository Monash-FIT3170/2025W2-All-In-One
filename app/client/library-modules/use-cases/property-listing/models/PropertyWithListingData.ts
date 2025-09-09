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
  agentId: string;
  tenantId: string;
  image_urls: string[];
  locationLatitude: number;
  locationLongitude: number;
  listing_status: string;
  propertyListingInspections: {
    tenant_ids: any;
    _id: any;
    start_time: Date;
    end_time: Date;
  }[];
}