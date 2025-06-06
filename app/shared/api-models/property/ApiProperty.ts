export type ApiProperty = {
  propertyId: string;
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
  landlordId: string;
  tenantId: string;
}