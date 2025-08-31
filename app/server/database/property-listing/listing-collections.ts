import { Mongo } from "meteor/mongo";
import { ListingDocument } from "./models/ListingDocument";
import { InspectionDocument } from "./models/InspectionDocument";
import { ListingStatusDocument } from "/app/server/database/property-listing/models/ListingStatusDocument";

export const InspectionCollection: Mongo.Collection<InspectionDocument> =
  new Mongo.Collection("inspections");
export const ListingCollection: Mongo.Collection<ListingDocument> =
  new Mongo.Collection("listings");
export const ListingStatusCollection: Mongo.Collection<ListingStatusDocument> =
  new Mongo.Collection("listing_statuses");
