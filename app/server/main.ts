import { Meteor } from "meteor/meteor";
import "./methods/example-tasks/task-methods";
import { PropertyCollection, PropertyFeatureCollection, PropertyPriceCollection, PropertyStatusCollection } from "./database/property/property-collections";

Meteor.startup(tempSeedPropertyData);

async function tempSeedPropertyData(): Promise<void> {
  if ((await PropertyCollection.find().countAsync()) === 0) {
    PropertyStatusCollection.insertAsync({
      _id: "1",
      name: "Vacant"
    })
    PropertyFeatureCollection.insertAsync({
      _id: "1",
      name: "Pool"
    })
    PropertyFeatureCollection.insertAsync({
      _id: "2",
      name: "Lots of space"
    })
    PropertyPriceCollection.insertAsync({
      property_id: "1",
      price_per_month: 1500,
      date_set: new Date(),
    });
    PropertyCollection.insertAsync({
      _id: "1",
      streetnumber: "123",
      streetname: "Sample st",
      suburb: "Springfield",
      province: "IL",
      postcode: "62704",
      property_status_id: "1",
      description: "A lovely home with a pool.",
      bathrooms: 2,
      bedrooms: 3,
      parking: 2,
      property_feature_ids: ["1", "2"],
      type: "House",
    });
  }
}