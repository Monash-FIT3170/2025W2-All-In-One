export type PropertyDocument = {
  _id: string;
  streetnumber: string;
  streetname: string;
  suburb: string;
  province: string;
  postcode: string;
  apartment_number?: string;
  property_status_id: string;
  description: string;
  summary_description: string;
  bathrooms: number;
  bedrooms: number;
  parking: number;
  property_feature_ids: string[];
  type: string;
  area?: number;
  agent_id: string;
  landlord_id: string;
  tenant_id: string;
  property_coordinate_id: string;
}