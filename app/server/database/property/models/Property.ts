
export type Property = {
  _id: string;
  streetnumber: string;
  streetname: string;
  suburb: string;
  province: string;
  postcode: string;
  property_status_id: string;
  description: string;
  bathrooms: number;
  bedrooms: number;
  property_feature_ids: string[];
  type: string;
  area: number;
}