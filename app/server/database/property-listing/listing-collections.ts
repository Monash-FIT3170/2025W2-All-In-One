import { Mongo } from "meteor/mongo";
import { InspectionDocument } from "./models/InspectionDocument";
import { ListingDocument } from "./models/ListingDocument";

export const InspectionCollection: Mongo.Collection<InspectionDocument> =
  new Mongo.Collection("inspections");
export const ListingCollection: Mongo.Collection<ListingDocument> =
  new Mongo.Collection("listings");
