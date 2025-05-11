
export type PropertyDTO = {
  propertyId: string;
  streetnumber: string;
  streetname: string;
  suburb: string;
  province: string;
  postcode: string;
  propertyStatus: string;
  description: string;
  bathrooms: number;
  bedrooms: number;
  features: string[];
  type: string;
  area?: number;
}