import { deleteDraftListing } from "../../domain-models/property-listing/repositories/listing-repository";

export async function deleteDraftListingUseCase(propertyId: string): Promise<void> {
  return deleteDraftListing(propertyId);
}