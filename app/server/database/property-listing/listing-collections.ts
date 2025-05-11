import { Mongo } from "meteor/mongo";
import { Inspection } from "./models/Inspection";
import { Listing } from "./models/Listing";

export const InspectionCollection: Mongo.Collection<Inspection> =
  new Mongo.Collection("inspections");
export const ListingCollection: Mongo.Collection<Listing> =
  new Mongo.Collection("listings");
