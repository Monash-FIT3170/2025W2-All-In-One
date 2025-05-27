import { apiGetAllPropertyFeatures } from "../../../apis/property/property-features/feature-api";
import { PropertyFeatureDocument } from "/app/server/database/property/models/PropertyFeatureDocument";

export async function getAllPropertyFeatures(): Promise<PropertyFeatureDocument[]> {
  return await apiGetAllPropertyFeatures();
}
