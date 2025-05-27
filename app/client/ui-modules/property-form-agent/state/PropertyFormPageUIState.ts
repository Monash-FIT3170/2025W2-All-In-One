import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { PropertyFeatureDocument } from "/app/server/database/property/models/PropertyFeatureDocument";

export type PropertyFormPageUiState = {
  landlords: Landlord[],
  features: PropertyFeatureDocument[],
  featureOptions: { value: string; label: string }[];
};
