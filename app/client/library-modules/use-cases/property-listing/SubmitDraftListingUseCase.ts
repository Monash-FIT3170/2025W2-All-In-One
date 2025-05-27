import { submitDraftListing } from "/app/client/library-modules/domain-models/property-listing/repositories/listing-repository";

export async function submitDraftListingUseCase(propertyId: string): Promise<void> {
  await submitDraftListing(propertyId);
}
