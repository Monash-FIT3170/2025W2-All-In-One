import { Meteor } from "meteor/meteor";
import "./methods/azure/blob-methods";
import "./methods/tasks/task-methods";
import "./methods/property/property-methods";
import "./methods/property-listing/listing-methods";
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
import "./methods/user/user.register";
import "./methods/user/user-account-methods";
import "./methods/user/role-methods/agent-methods";
import "./methods/user/role-methods/tenant-methods";
import "./methods/user/role-methods/landlord-methods";
import {
  TaskCollection,
  TaskStatusCollection,
} from "/app/server/database/task/task-collections";
import {
  AgentCollection,
  TenantCollection,
  UserAccountCollection,
  LandlordCollection,
} from "./database/user/user-collections";
import { Role } from "../shared/user-role-identifier";
import { TaskStatus } from "../shared/task-status-identifier";

Meteor.startup(tempSeedPropertyData);
Meteor.startup(tempSeedTaskData);
Meteor.startup(tempSeedUserAndRoleData);


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
      summary_description:
        "Modern apartment with spacious living areas and a beautiful garden.",
      bathrooms: 2,
      bedrooms: 3,
      parking: 2,
      property_feature_ids: ["1", "2"],
      type: "House",
      area: 500,
      agent_id: "1",
      landlord_id: "1",
      tenant_id: "1",
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
    TaskStatusCollection.insertAsync({
      _id: "1",
      name: "Not Started",
    });

    TaskStatusCollection.insertAsync({
      _id: "2",
      name: "In Progress",
    });

    TaskStatusCollection.insertAsync({
      _id: "3",
      name: "Completed",
    });

    TaskCollection.insertAsync({
      _id: "1",
      name: "Initial listing meeting",
      taskStatus: TaskStatus.NOTSTARTED,
      createdDate: new Date("2025-04-12T10:00:00Z"),
      dueDate: new Date("2025-04-19T10:00:00Z"),
      description:
        "Meet with the client to discuss the property listing process and gather necessary information.",
      priority: "High",
    });
    TaskCollection.insertAsync({
      _id: "2",
      name: "Follow-up with client",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-04-27T10:00:00Z"),
      description:
        "Check in with the client to provide updates and address any questions.",
      priority: "Medium",
    });
  }
}

// This function is used to seed the database with initial user + role
async function tempSeedUserAndRoleData(): Promise<void> {
  if ((await UserAccountCollection.find().countAsync()) === 0) {
    UserAccountCollection.insertAsync({
      _id: "1",
      role: Role.AGENT,
    });

    UserAccountCollection.insertAsync({
      _id: "2",
      role: Role.LANDLORD,
    });

    UserAccountCollection.insertAsync({
      _id: "3",
      role: Role.TENANT,
    });

    UserAccountCollection.insertAsync({
      _id: "4",
      role: Role.LANDLORD,
    });

    UserAccountCollection.insertAsync({
      _id: "5",
      role: Role.AGENT,
    });

    AgentCollection.insertAsync({
      _id: "1", // agent id - primary key
      userId: "1", // id for the user account - used for auth/admin purposes only
      task_ids: [], // array of task ids
      firstName: "CassandraAgent", // first name of the agent
      lastName: "Vemor", // last name of the agent
      email: "cassandratestgmail@gmail.com", // email of the agent,
      agentCode: "AGT123", // NOT SURE WHAT THIS FIELD IS FOR
      createdAt: new Date(), // current date
    });

    TenantCollection.insertAsync({
      _id: "2", // tenant id - primary key
      userId: "3", // id for the user account - used for auth/admin purposes only
      task_ids: [], // array of task ids
      firstName: "TestTenant", // first name of the tenant
      lastName: "Rod", // last name of the tenant
      email: "testingtenantemail@gmail.com", // email of the tenant
      createdAt: new Date(), // current date
    });

    LandlordCollection.insertAsync({
      _id: "3", // landlord id - primary key
      userId: "2", // id for the user account - used for auth/admin purposes only
      task_ids: [], // array of task ids
      firstName: "TestLandlord", // first name of the landlord
      lastName: "Rod", // last name of the landlord
      email: "testinglandlordemail@gmail.com", // email of the landlord
      createdAt: new Date(), // current date
    });

    LandlordCollection.insertAsync({
      _id: "4", // landlord id - primary key
      userId: "4", // id for the user account - used for auth/admin purposes only
      task_ids: [], // array of task ids
      firstName: "landlordLucy", // first name of the landlord
      lastName: "Trainer", // last name of the landlord
      email: "lucylandlordtestemail@gmail.com", // email of the landlord
      createdAt: new Date(), // current date
    });

    AgentCollection.insertAsync({
      _id: "5", // agent id - primary key
      userId: "5", // id for the user account - used for auth/admin purposes only
      task_ids: [], // array of task ids
      firstName: "AgentTrent", // first name of the agent
      lastName: "Todd", // last name of the agent
      email: "trenttodtest@gmail.com", // email of the agent,
      agentCode: "AGT444", // NOT SURE WHAT THIS FIELD IS FOR
      createdAt: new Date(), // current date
    });
  }
}
