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

/**
 * Use case for loading property data with conditional tenant application loading
 *
 * This encapsulates the business logic for determining when tenant applications
 * should be loaded based on the property's listing status.
 */
export class LoadPropertyWithTenantApplicationsUseCase {
  /**
   * Determines if tenant applications should be loaded based on listing status
   * @param listingStatus - The current listing status
   * @returns True if tenant applications should be loaded
   */
  private shouldLoadTenantApplications(listingStatus: ListingStatus): boolean {
    return [
      ListingStatus.LISTED,
      ListingStatus.TENANT_SELECTION,
      ListingStatus.TENANT_APPROVAL
    ].includes(listingStatus);
  }

  /**
   * Executes the use case to load property data and determine tenant application loading
   * @param propertyId - The property ID to load
   * @returns Promise that resolves to the load result with tenant application loading decision
   */
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
