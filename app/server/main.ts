import { Meteor } from "meteor/meteor";
import "./methods/tasks/task-methods";
import "./methods/property/property-methods";
import "./methods/property-listing/listing-methods"
import {
  PropertyCollection,
  PropertyFeatureCollection,
  PropertyPriceCollection,
  PropertyStatusCollection,
} from "./database/property/property-collections";
import {
  InspectionCollection,
  ListingCollection,
  ListingStatusCollection,
} from "/app/server/database/property-listing/listing-collections";
import { TaskCollection } from "/app/server/database/task/task-collections";
Meteor.startup(tempSeedPropertyData);
Meteor.startup(tempSeedTaskData);

// This function is used to seed the database with initial property data
async function tempSeedPropertyData(): Promise<void> {
  if ((await PropertyCollection.find().countAsync()) === 0) {
    PropertyStatusCollection.insertAsync({
      _id: "1",
      name: "Vacant",
    });

    PropertyFeatureCollection.insertAsync({
      _id: "1",
      name: "Pool",
    });
    PropertyFeatureCollection.insertAsync({
      _id: "2",
      name: "Lots of space",
    });

    PropertyPriceCollection.insertAsync({
      property_id: "1",
      price_per_month: 1500,
      date_set: new Date(),
    });

    PropertyCollection.insertAsync({
      _id: "1",
      streetnumber: "123",
      streetname: "Sample St",
      suburb: "Springfield",
      province: "IL",
      postcode: "62704",
      property_status_id: "1",
      description:
        "Modern apartment with spacious living areas and a beautiful garden. Recently renovated with new appliances and fixtures throughout. The property features an open-plan kitchen and dining area that flows onto a private balcony with city views. The master bedroom includes an ensuite bathroom and built-in wardrobes, while the second bedroom is generously sized and located near the main bathroom.",
      summary_description: "Modern apartment with spacious living areas and a beautiful garden.",
      bathrooms: 2,
      bedrooms: 3,
      parking: 2,
      property_feature_ids: ["1", "2"],
      type: "House",
      area: 500
    });

    InspectionCollection.insertAsync({
      _id: "1",
      starttime: new Date("2025-04-12T10:00:00Z"),
      endtime: new Date("2025-04-13T11:00:00Z"),
    });
    InspectionCollection.insertAsync({
      _id: "2",
      starttime: new Date("2025-04-14T10:00:00Z"),
      endtime: new Date("2025-04-15T11:00:00Z"),
    });

    ListingCollection.insertAsync({
      property_id: "1",
      listing_status_id: "1",
      image_urls: [
        "https://cdn.pixabay.com/photo/2018/08/04/11/30/draw-3583548_1280.png",
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
        "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
      ],
      inspection_ids: ["1", "2"],
    });

    ListingStatusCollection.insertAsync({
      _id: "1",
      name: "Draft",
    });
  }
}
// This function is used to seed the database with initial task data
async function tempSeedTaskData(): Promise<void> {
  if ((await TaskCollection.find().countAsync()) === 0) {
    TaskCollection.insertAsync({
      _id: "1",
      name: "Initial listing meeting",
      status: "Not started",
      createdDate: new Date("2025-04-12T10:00:00Z"),
      dueDate: new Date("2025-04-19T10:00:00Z"),
      description: "Meet with the client to discuss the property listing process and gather necessary information.",
      priority: "High",
      user_id: "1"
    });
    TaskCollection.insertAsync({
      _id: "2",
      name: "Follow-up with client",
      status: "Not started",
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-04-27T10:00:00Z"),
      description: "Check in with the client to provide updates and address any questions.",
      priority: "Medium",
      user_id: "1"
    });
  }
}
