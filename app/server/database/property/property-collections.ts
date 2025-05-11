import { Mongo } from "meteor/mongo";
import { Property } from "/app/server/database/property/models/Property";
import { PropertyFeature } from "/app/server/database/property/models/PropertyFeature";
import { PropertyPrice } from "/app/server/database/property/models/PropertyPrice";
import { PropertyStatus } from "/app/server/database/property/models/PropertyStatus";

export const PropertyCollection: Mongo.Collection<Property> =
  new Mongo.Collection("properties");
export const PropertyFeatureCollection: Mongo.Collection<PropertyFeature> =
  new Mongo.Collection("property_features");
export const PropertyPriceCollection: Mongo.Collection<PropertyPrice> =
  new Mongo.Collection("property_prices");
export const PropertyStatusCollection: Mongo.Collection<PropertyStatus> =
  new Mongo.Collection("property_statuses");