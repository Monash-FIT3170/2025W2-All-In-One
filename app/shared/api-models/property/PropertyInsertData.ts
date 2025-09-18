export type PropertyInsertData = {
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
}

export type PropertyFormData = {
  streetnumber: string;
  streetname: string;
  suburb: string;
  province: string;
  postcode: string;
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
  monthly_rent: number;
  images: File[];
}