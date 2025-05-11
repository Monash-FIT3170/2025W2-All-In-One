import { Meteor } from "meteor/meteor";
import "./methods/example-tasks/task-methods";
import { PropertyCollection, PropertyFeatureCollection, PropertyStatusCollection } from "/app/server/database/property/PropertyCollections";

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
      property_feature_ids: ["1", "2"],
      type: "House",
    });
  }
}