import { ApiListing } from "/app/shared/api-models/property-listing/ApiListing";
import { ApiInsertListingPayload } from "/app/shared/api-models/property-listing/ListingInsertData";
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

export async function apiGetListingForProperty(
  propertyId: string
): Promise<ApiListing> {
  const fetchedListing = await Meteor.callAsync(
    MeteorMethodIdentifier.LISTING_GET_FOR_PROPERTY,
    propertyId
  );

  return fetchedListing;
}

export async function apiGetAllListedListings(skip = 0, limit = 3): Promise<ApiListing[]> {
  const fetchedListings: ApiListing[] = await Meteor.callAsync(
    MeteorMethodIdentifier.LISTING_GET_ALL_LISTED,
    skip,
    limit
  );
  return fetchedListings;
}

export async function apiInsertPropertyListing(
  propertyId: string,
  imageUrls: string[],
  status: ListingStatus,
  inspectionIds: string[],
  leaseTerm: string,
) {
  const data: ApiInsertListingPayload = {
    property_id: propertyId,
    image_urls: imageUrls,
    inspection_ids: inspectionIds,
    lease_term: leaseTerm,
  };
  const insertedListing: string = await Meteor.callAsync(
    MeteorMethodIdentifier.INSERT_PROPERTY_LISTING,
    data,
    status
  );
  return insertedListing;
}

export async function apiGetListingStatusByName(name: string): Promise<string> {
  const listingStatusId = await Meteor.callAsync(
    MeteorMethodIdentifier.LISTING_STATUS_GET_BY_NAME,
    name
  );
  return listingStatusId;
}
export async function apiSubmitDraftListing(propertyId: string): Promise<void> {
  await Meteor.callAsync(
    MeteorMethodIdentifier.LISTING_SUBMIT_DRAFT,
    propertyId
  );
}

export async function apiUpdatePropertyListingImages(
  propertyId: string,
  imageUrls: string[]
): Promise<{ success: boolean; propertyId: string }> {
  return await Meteor.callAsync(
    MeteorMethodIdentifier.LISTING_UPDATE_IMAGES,
    propertyId,
    imageUrls
  );
}

export async function apiInsertPropertyListingInspections(
  propertyListingInspections: { start_time: Date; end_time: Date }[]
): Promise<string[]> {
  const ids = await Meteor.callAsync(
    MeteorMethodIdentifier.INSERT_PROPERTY_LISTING_INSPECTION,
    propertyListingInspections
  );
  return ids;
}
