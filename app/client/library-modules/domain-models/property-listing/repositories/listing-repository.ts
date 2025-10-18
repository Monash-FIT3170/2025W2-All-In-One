import { apiGetListingForProperty, apiSubmitDraftListing, apiGetAllListedListings, apiInsertPropertyListing, apiUpdatePropertyListingImages, apiInsertPropertyListingInspections, addTenantToInspectionApi, apiDeleteDraftListing } from "../../../apis/property-listing/listing-api";
import { Listing } from "/app/client/library-modules/domain-models/property-listing/Listing";
import { mapApiListingToListing } from "./mappers/listing-mapper";
import { ApiListing } from "/app/shared/api-models/property-listing/ApiListing";
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";
import { PropertyListingInspectionDocument } from "/app/server/database/property-listing/models/PropertyListingInspectionDocument";


export async function getListingByPropertyId(id: string): Promise<Listing> {
  const apiListing = await apiGetListingForProperty(id);
  const mappedListing = mapApiListingToListing(apiListing);

  return mappedListing;
}

export async function submitDraftListing(propertyId: string): Promise<void> {
  await apiSubmitDraftListing(propertyId);
}

export async function deleteDraftListing(propertyId: string): Promise<void> {
  await apiDeleteDraftListing(propertyId);
}


export async function getAllListedListings(skip = 0, limit = 3): Promise<{ apiListing: ApiListing }[]> {
  const apiListings = await apiGetAllListedListings(skip, limit);
  return apiListings.map(apiListing => ({ apiListing }));
}

export async function insertPropertyListing(
  propertyId: string,
  imageUrls: string[],
  status: ListingStatus,
  inspectionIds: string[],
  leaseTerm: string
): Promise<string> {
  return await apiInsertPropertyListing(propertyId, imageUrls, status, inspectionIds, leaseTerm);
}

export async function insertPropertyListingInspections(
  propertyListingInspections: { start_time: Date; end_time: Date; tenant_ids: string[]; }[]
): Promise<string[]> {
  return apiInsertPropertyListingInspections(propertyListingInspections);
}

export async function updatePropertyListingImages(
  propertyId: string,
  imageUrls: string[]
): Promise<{ success: boolean; propertyId: string }> {
  return await apiUpdatePropertyListingImages(propertyId, imageUrls);
}


export class ListingRepository {
  async addTenantToInspection(
    inspectionId: string,
    tenantId: string
  ): Promise<PropertyListingInspectionDocument> {
    return await addTenantToInspectionApi(inspectionId, tenantId);
  }
}