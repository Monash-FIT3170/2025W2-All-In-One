import { Mongo } from "meteor/mongo";
import { ListingDocument } from "./models/ListingDocument";
import { PropertyListingInspectionDocument } from "./models/PropertyListingInspectionDocument";
import { ListingStatusDocument } from "/app/server/database/property-listing/models/ListingStatusDocument";

export const PropertyListingInspectionCollection: Mongo.Collection<PropertyListingInspectionDocument> =
  new Mongo.Collection("propertyListingInspections");
export const ListingCollection: Mongo.Collection<ListingDocument> =
  new Mongo.Collection("listings");
export const ListingStatusCollection: Mongo.Collection<ListingStatusDocument> =
  new Mongo.Collection("listing_statuses");
