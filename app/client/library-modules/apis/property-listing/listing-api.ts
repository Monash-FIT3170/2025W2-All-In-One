import { ApiListing } from "/app/shared/api-models/property-listing/ApiListing";
import { IncompleteListingInsertData } from "/app/shared/api-models/property-listing/ListingInsertData";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

export async function apiGetListingForProperty(propertyId: string): Promise<ApiListing> {
  const fetchedListing = await Meteor.callAsync(MeteorMethodIdentifier.LISTING_GET_FOR_PROPERTY, propertyId);

  return fetchedListing
}

export async function apiGetAllListedListings(): Promise<ApiListing[]> {
  const fetchedListings: ApiListing[] = await Meteor.callAsync(MeteorMethodIdentifier.LISTING_GET_ALL_LISTED);

  return fetchedListings;
}

export async function apiInsertPropertyListing(propertyId: string,imageUrls: string[]){
  const data: IncompleteListingInsertData = {
    property_id : propertyId,
    image_urls : imageUrls,
    inspection_ids : [],
  }
  const insertedListing: string = await Meteor.callAsync(MeteorMethodIdentifier.LISTING_INSERT_PROPERTY, data);
  return insertedListing
}