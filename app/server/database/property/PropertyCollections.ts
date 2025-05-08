import { Mongo } from "meteor/mongo";
import { Inspection } from "/app/server/database/property/models/Inspection";
import { Listing } from "/app/server/database/property/models/Listing";
import { Property } from "/app/server/database/property/models/Property";
import { PropertyFeature } from "/app/server/database/property/models/PropertyFeature";
import { PropertyPrice } from "/app/server/database/property/models/PropertyPrice";

export const InspectionCollection: Mongo.Collection<Inspection> =
  new Mongo.Collection("inspections");
export const ListingCollection: Mongo.Collection<Listing> =
  new Mongo.Collection("listings");
export const PropertyCollection: Mongo.Collection<Property> =
  new Mongo.Collection("properties");
export const PropertyFeatureCollection: Mongo.Collection<PropertyFeature> =
  new Mongo.Collection("property_features");
export const PropertyPriceCollection: Mongo.Collection<PropertyPrice> =
  new Mongo.Collection("property_prices");
