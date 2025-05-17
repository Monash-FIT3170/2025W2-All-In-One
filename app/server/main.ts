import { Meteor } from "meteor/meteor";
import "./methods/azure/blob-methods";
import "./methods/example-tasks/task-methods";
import "./methods/user/user.register";
import "./methods/user/user-methods";
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

Meteor.startup(tempSeedPropertyData);

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
