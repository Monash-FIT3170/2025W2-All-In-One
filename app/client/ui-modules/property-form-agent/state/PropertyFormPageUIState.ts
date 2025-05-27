import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";

export type PropertyFormPageUiState = {
  landlords: (Landlord & { firstName: string; lastName: string })[];
};
