import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiListing } from "/app/client/library-modules/apis/listing/ApiListing";

export async function apiGetAllListings(): Promise<ApiListing[]> {
  const fetchedTasks: ApiListing[] = await Meteor.callAsync(
    MeteorMethodIdentifier.LISTING_GET_ALL
  );

  return fetchedTasks;
}
