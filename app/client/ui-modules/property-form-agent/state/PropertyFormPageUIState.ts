import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { PropertyFeatureDocument } from "/app/server/database/property/models/PropertyFeatureDocument";

export type PropertyFormPageUiState = {
  propertyId: string;
  landlords: (Landlord & { firstName: string; lastName: string })[];
  features: PropertyFeatureDocument[];
  featureOptions: { value: string; label: string }[];
};
