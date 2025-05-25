import { Meteor } from "meteor/meteor";
import "./methods/azure/blob-methods";
import "./methods/task/task-methods";
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
import "/app/server/methods/property-status/property-status-methods";
import "./methods/user/user.register";
import "./methods/user/user-account-methods";
import "./methods/user/role-methods/agent-methods";
import "./methods/user/role-methods/tenant-methods";
import "./methods/user/role-methods/landlord-methods";
import { TaskCollection } from "/app/server/database/task/task-collections";
import { AgentCollection } from "./database/user/user-collections";
import { TenantCollection } from "./database/user/user-collections";
import { LandlordCollection } from "./database/user/user-collections";
import { Role } from "../shared/user-role-identifier";
import { TaskStatus } from "../shared/task-status-identifier";
import { MeteorMethodIdentifier } from "../shared/meteor-method-identifier";
import { ApiAgent } from "../shared/api-models/user/api-roles/ApiAgent";
import { ApiTenant } from "../shared/api-models/user/api-roles/ApiTenant";
import { ApiLandlord } from "../shared/api-models/user/api-roles/ApiLandlord";
import { AgentCollection } from "./database/user/user-collections";
import { PropertyStatus } from "../shared/api-models/property/PropertyStatus";

import { ListingStatus } from "../shared/api-models/property-listing/ListingStatus";

let globalAgent: ApiAgent;
let globalTenant: ApiTenant;
let globalLandlord: ApiLandlord;

Meteor.startup(async () => {
  await tempSeedUserAndRoleData();
  await tempSeedPropertyData();
  await tempSeedTaskData();
  await permSeedListingStatusData();
});

async function tempSeedUserAndRoleData(): Promise<void> {
  const seedUsers = [
    {
      email: "testingagent@gmail.com",
      password: "password123",
      firstName: "CassandraAgent",
      lastName: "Vemor",
      accountType: Role.AGENT,
      agentCode: "AGENT123",
    },
    {
      email: "testingtenantemail@gmail.com",
      password: "password123",
      firstName: "TestTenant",
      lastName: "Rod",
      accountType: Role.TENANT,
    },
    {
      email: "testinglandlordemail@gmail.com",
      password: "password123",
      firstName: "TestLandlord",
      lastName: "Rod",
      accountType: Role.LANDLORD,
    },
  ];

  for (const user of seedUsers) {
    const existing = await Meteor.users.findOneAsync({
      "emails.address": user.email,
    });
    if (existing) {
      console.log(`[Seed] Skipped existing user: ${user.email}`);
      const dto = await Meteor.callAsync(
        user.accountType === Role.AGENT
          ? MeteorMethodIdentifier.AGENT_GET
          : user.accountType === Role.TENANT
          ? MeteorMethodIdentifier.TENANT_GET
          : MeteorMethodIdentifier.LANDLORD_GET,
        existing._id
      );

      if (user.accountType === Role.AGENT) globalAgent = dto;
      if (user.accountType === Role.TENANT) globalTenant = dto;
      if (user.accountType === Role.LANDLORD) globalLandlord = dto;
      continue;
    }

    try {
      const { userAccountId } = await Meteor.callAsync(
        MeteorMethodIdentifier.USER_REGISTER,
        user
      );

      const dto = await Meteor.callAsync(
        user.accountType === Role.AGENT
          ? MeteorMethodIdentifier.AGENT_GET
          : user.accountType === Role.TENANT
          ? MeteorMethodIdentifier.TENANT_GET
          : MeteorMethodIdentifier.LANDLORD_GET,
        userAccountId
      );

      if (user.accountType === Role.AGENT) globalAgent = dto;
      if (user.accountType === Role.TENANT) globalTenant = dto;
      if (user.accountType === Role.LANDLORD) globalLandlord = dto;

      console.log(`[Seed] Created user: ${user.email}`);
    } catch (err) {
      console.error(`[Seed] Failed to create user: ${user.email}`, err);
    }
  }
}

async function tempSeedPropertyData(): Promise<void> {
  console.log("Seeding property data...");
  if ((await PropertyCollection.find().countAsync()) === 0) {
    // Seed property statuses first
    const statuses = [
      { _id: "1", name: PropertyStatus.VACANT },
      { _id: "2", name: PropertyStatus.OCCUPIED },
      { _id: "3", name: PropertyStatus.UNDER_MAINTENANCE },
      { _id: "4", name: PropertyStatus.CLOSED },
      { _id: "5", name: PropertyStatus.DRAFT },
      { _id: "6", name: PropertyStatus.LISTED }
    ];

    // Add new status if it doesn't exist
    for (const status of statuses) {
      const existingStatus = await PropertyStatusCollection.findOneAsync({ _id: status._id });
      if (!existingStatus) {
        await PropertyStatusCollection.insertAsync(status);
      }
    }

    await PropertyFeatureCollection.insertAsync({
      _id: "1",
      name: "Pool",
    });

    await PropertyFeatureCollection.insertAsync({
      _id: "2",
      name: "Lots of space",
    });

    await PropertyFeatureCollection.insertAsync({
      _id: "3",
      name: "Garden",
    });

    await PropertyPriceCollection.insertAsync({
      _id: "1",
      property_id: "1",
      price_per_month: 1500,
      date_set: new Date(),
    });

    await PropertyPriceCollection.insertAsync({
      _id: "2",
      property_id: "2",
      price_per_month: 1300,
      date_set: new Date(),
    });

    await PropertyPriceCollection.insertAsync({
      _id: "3",
      property_id: "3",
      price_per_month: 2000,
      date_set: new Date(),
    });

    await PropertyCollection.insertAsync({
      _id: "1",
      streetnumber: "123",
      streetname: "Main St",
      suburb: "Suburbia",
      province: "Province",
      postcode: "1234",
      property_status_id: "1", // Using the ID of VACANT status
      description: "A beautiful property",
      summary_description: "Beautiful property in a great location",
      bathrooms: 2,
      bedrooms: 3,
      parking: 2,
      property_feature_ids: ["1", "2"],
      type: "House",
      area: 200,
      agent_id: globalAgent.agentId,
      landlord_id: globalLandlord.landlordId,
      tenant_id: globalTenant.tenantId,
    });

    await PropertyCollection.insertAsync({
      _id: "2",
      streetnumber: "456",
      streetname: "Oak Ave",
      suburb: "Oakville",
      province: "Province",
      postcode: "5678",
      property_status_id: "2", // Using the ID of OCCUPIED status
      description: "Modern apartment",
      summary_description: "Modern apartment in the city center",
      bathrooms: 1,
      bedrooms: 2,
      parking: 1,
      property_feature_ids: ["2", "3"],
      type: "Apartment",
      area: 100,
      agent_id: globalAgent.agentId,
      landlord_id: globalLandlord.landlordId,
      tenant_id: globalTenant.tenantId,
    });

    await PropertyCollection.insertAsync({
      _id: "3",
      streetnumber: "789",
      streetname: "Pine Rd",
      suburb: "Pineville",
      province: "Province",
      postcode: "9012",
      property_status_id: "3", // Using the ID of UNDER_MAINTENANCE status
      description: "Spacious house",
      summary_description: "Spacious house with large garden",
      bathrooms: 3,
      bedrooms: 4,
      parking: 2,
      property_feature_ids: ["1", "2", "3"],
      type: "House",
      area: 300,
      agent_id: globalAgent.agentId,
      landlord_id: globalLandlord.landlordId,
      tenant_id: globalTenant.tenantId,
    });

    await InspectionCollection.insertAsync({
      _id: "1",
      starttime: new Date("2025-04-12T10:00:00Z"),
      endtime: new Date("2025-04-13T11:00:00Z"),
    });
    await InspectionCollection.insertAsync({
      _id: "2",
      starttime: new Date("2025-04-14T10:00:00Z"),
      endtime: new Date("2025-04-15T11:00:00Z"),
    });

    await InspectionCollection.insertAsync({
      _id: "3",
      starttime: new Date("2025-04-16T10:00:00Z"),
      endtime: new Date("2025-04-17T11:00:00Z"),
    });

    await ListingCollection.insertAsync({
      property_id: "1",
      listing_status_id: "1",
      image_urls: [
        "https://cdn.pixabay.com/photo/2018/08/04/11/30/draw-3583548_1280.png",
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
        "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
      ],
      inspection_ids: ["1", "2"],
    });
  }
}
// This function is used to seed the database with initial task data
async function tempSeedTaskData(): Promise<void> {
  if ((await TaskCollection.find().countAsync()) === 0) {
    // Insert tasks into the TaskCollection
    await TaskCollection.insertAsync({
      _id: "1",
      name: "Property Inspection - 123 Sample St",
      taskStatus: TaskStatus.NOTSTARTED,
      createdDate: new Date("2025-04-12T10:00:00Z"),
      dueDate: new Date("2025-05-19T10:00:00Z"),
      description:
        "Meet with the client to discuss the property listing process and gather necessary information.",
      priority: "High",
    });

    // Task 2: Client Meeting
    const task2Id = await TaskCollection.insertAsync({
      _id: "2",
      name: "Client Meeting - Property Listing",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date(),
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      description: "Meet with landlord to discuss property listing details",
      priority: "High",
    });

    // Task 3: Marketing Preparation
    const task3Id = await TaskCollection.insertAsync({
      _id: "3",
      name: "Prepare Marketing Materials",
      taskStatus: TaskStatus.NOTSTARTED,
      createdDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      description: "Create marketing materials for new property listings",
      priority: "Medium",
    });




async function permSeedListingStatusData(): Promise<void> {
  if ((await ListingStatusCollection.find().countAsync()) === 0) {
    console.log("Seeding listing status data...");
    await ListingStatusCollection.insertAsync({
      _id: "1",
      name: ListingStatus.DRAFT,
    });
    await ListingStatusCollection.insertAsync({
      _id: "2",
      name: ListingStatus.LISTED,
    });
    await ListingStatusCollection.insertAsync({
      _id: "3",
      name: ListingStatus.TENANT_SELECTION,
    });
    await ListingStatusCollection.insertAsync({
      _id: "4",
      name: ListingStatus.TENANT_APPROVAL,
    });
  }
}
