import { PropertyStatus} from "/app/shared/api-models/property/PropertyStatus";

export type PropertyDocument = {
  _id: string;
  streetnumber: string;
  streetname: string;
  suburb: string;
  province: string;
  postcode: string;
  property_status_id: PropertyStatus;
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