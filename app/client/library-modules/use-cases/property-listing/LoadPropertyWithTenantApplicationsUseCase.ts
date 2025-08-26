import { getPropertyWithListingDataUseCase } from "./GetPropertyWithListingDataUseCase";
import { getAllLandlords } from "/app/client/library-modules/domain-models/user/role-repositories/landlord-repository";
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";
import { PropertyWithListingData } from "./models/PropertyWithListingData";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";

export interface LoadPropertyWithTenantApplicationsResult {
  propertyWithListingData: PropertyWithListingData;
  landlords: Landlord[];
  shouldLoadTenantApplications: boolean;
}

// Determine if tenant applications should be loaded
export class LoadPropertyWithTenantApplicationsUseCase {

  private shouldLoadTenantApplications(listingStatus: ListingStatus): boolean {
    return [
      ListingStatus.LISTED,
      ListingStatus.TENANT_SELECTION,
      ListingStatus.TENANT_APPROVAL
    ].includes(listingStatus);
  }

  async execute(propertyId: string): Promise<LoadPropertyWithTenantApplicationsResult> {
    // Load property and listing data
    const propertyWithListingData = await getPropertyWithListingDataUseCase(propertyId);

    // Load landlords data
    const landlords = await getAllLandlords();

    // Determine if tenant applications should be loaded based on listing status
    const shouldLoadTenantApplications = this.shouldLoadTenantApplications(
      propertyWithListingData.listing_status as ListingStatus
    );

    return {
      propertyWithListingData,
      landlords,
      shouldLoadTenantApplications
    };
  }
}
