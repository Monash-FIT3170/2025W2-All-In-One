import { getListingByPropertyId } from "/app/client/library-modules/domain-models/property-listing/repositories/listing-repository";
import { getPropertyById } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { PropertyWithListingData } from "/app/client/library-modules/use-cases/property-listing/models/PropertyWithListingData";

export async function getPropertyWithListingDataUseCase(
  propertyId: string
): Promise<PropertyWithListingData> {
  const property = await getPropertyById(propertyId);
  const listing = await getListingByPropertyId(propertyId);

  return {
    ...property,
    ...listing
  };

}