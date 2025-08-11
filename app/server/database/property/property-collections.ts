import { Mongo } from "meteor/mongo";
import { PropertyDocument } from "./models/PropertyDocument";
import { PropertyFeatureDocument } from "./models/PropertyFeatureDocument";
import { PropertyPriceDocument } from "./models/PropertyPriceDocument";
import { PropertyStatusDocument } from "./models/PropertyStatusDocument";
import { PropertyCoordinateDocument } from "./models/PropertyCoordinateDocument";

export const PropertyCollection: Mongo.Collection<PropertyDocument> =
  new Mongo.Collection("properties");
export const PropertyFeatureCollection: Mongo.Collection<PropertyFeatureDocument> =
  new Mongo.Collection("property_features");
export const PropertyPriceCollection: Mongo.Collection<PropertyPriceDocument> =
  new Mongo.Collection("property_prices");
export const PropertyStatusCollection: Mongo.Collection<PropertyStatusDocument> =
  new Mongo.Collection("property_statuses");
export const PropertyCoordinatesCollection: Mongo.Collection<PropertyCoordinateDocument> =
  new Mongo.Collection("property_coordinates");