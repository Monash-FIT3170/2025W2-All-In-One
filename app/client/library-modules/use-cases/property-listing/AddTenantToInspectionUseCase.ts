import { ListingRepository } from "../../domain-models/property-listing/repositories/listing-repository";
import { PropertyListingInspectionDocument } from "/app/server/database/property-listing/models/PropertyListingInspectionDocument";

export class AddTenantToInspectionUseCase {
  constructor(private listingRepo: ListingRepository) {}

  async execute(
    inspectionId: string,
    tenantId: string
  ): Promise<PropertyListingInspectionDocument> {
    // could do validation here if needed
    return await this.listingRepo.addTenantToInspection(inspectionId, tenantId);
  }
}