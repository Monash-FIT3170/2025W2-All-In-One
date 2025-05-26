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
import { AgentCollection } from "/app/server/database/user/user-collections";
import { TenantCollection } from "./database/user/user-collections";
import { LandlordCollection } from "./database/user/user-collections";
import { Role } from "../shared/user-role-identifier";
import { TaskStatus } from "../shared/task-status-identifier";
import { MeteorMethodIdentifier } from "../shared/meteor-method-identifier";
import { ApiAgent } from "../shared/api-models/user/api-roles/ApiAgent";
import { ApiTenant } from "../shared/api-models/user/api-roles/ApiTenant";
import { ApiLandlord } from "../shared/api-models/user/api-roles/ApiLandlord";
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
  await seedListedProperties(globalAgent, globalLandlord, globalTenant);
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

    await InspectionCollection.insertAsync({
      _id: "4",
      starttime: new Date("2026-04-16T10:00:00Z"),
      endtime: new Date("2026-04-17T11:00:00Z"),
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

async function seedListedProperties(
  agent: ApiAgent,
  landlord: ApiLandlord,
  tenant: ApiTenant
): Promise<void> {
  const listedStatusId = "2";
  const propertyStatusVacantId = "1"; 
  const defaultFeatureIds = ["1", "2"]; 

  for (let i = 4; i <= 13; i++) { // Start from 4 to avoid conflict with IDs 1, 2, 3 from tempSeedPropertyData
    const propertyId = i.toString();
    await PropertyCollection.insertAsync({
      _id: propertyId,
      streetnumber: `${i * 10}`,
      streetname: "Central Street",
      suburb: ["Clayton", "Frankston", "Cranbourne", "Mexico"][i % 4],
      province: "NY",
      postcode: `${10000 + i}`,
      property_status_id: propertyStatusVacantId,
      description:
        `Spacious ${(i % 3) + 2}-bedroom property in a prime location. Features modern amenities and excellent transport links. ` +
        `Ideal for families or professionals looking for comfort and convenience. Property includes a well-maintained garden and off-street parking.`,
      summary_description: `Beautiful ${(i % 3) + 2}-bed property in ${["Clayton", "Frankston", "Cranbourne", "Mexico"][i % 4]}.`,
      bathrooms: (i % 2) + 1,
      bedrooms: (i % 3) + 2,
      parking: (i % 2) + 1,
      property_feature_ids: defaultFeatureIds,
      type: i % 2 === 0 ? "Apartment" : "Townhouse",
      area: 300 + i * 20,
      agent_id: agent?.agentId,
      landlord_id: landlord?.landlordId,
      tenant_id: tenant.tenantId,
    });

    await PropertyPriceCollection.insertAsync({
      property_id: propertyId,
      price_per_month: 1200 + i * 100,
      date_set: new Date(),
    });

    const imageUrls = [
      "https://cdn.pixabay.com/photo/2018/08/04/11/30/draw-3583548_1280.png",
      "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
    ];

    await ListingCollection.insertAsync({
      property_id: propertyId,
      listing_status_id: listedStatusId, // "Listed"
      image_urls: imageUrls,
      inspection_ids: ["1", "2", "3","4"],
    });
    console.log(`[Seed] Created listed property: ${propertyId}`);
  }
}

// This function is used to seed the database with initial task data
async function tempSeedTaskData(): Promise<void> {
  if ((await TaskCollection.find().countAsync()) === 0) {
    // Insert tasks into the TaskCollection
    await TaskCollection.insertAsync({
      _id: "1",
      name: "Initial listing meeting",
      taskStatus: TaskStatus.NOTSTARTED,
      createdDate: new Date("2025-04-12T10:00:00Z"),
      dueDate: new Date("2025-05-19T10:00:00Z"),
      description:
        "Meet with the client to discuss the property listing process and gather necessary information.",
      priority: "High",
    });
    await TaskCollection.insertAsync({
      _id: "2",
      name: "Follow-up with client",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-05-27T10:00:00Z"),
      description:
        "Check in with the client to provide updates and address any questions.",
      priority: "Medium",
    });
    await TaskCollection.insertAsync({
      _id: "3",
      name: "Select a tenant",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-05-28T10:00:00Z"),
      description:
        "Review the list of agent approved candidates and pick one.",
      priority: "Medium",
    });
    await TaskCollection.insertAsync({
      _id: "4",
      name: "Follow-up with client",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-05-27T10:00:00Z"),
      description:
        "Attend a property listing meeting with agent.",
      priority: "Medium",
    });
    await TaskCollection.insertAsync({
      _id: "5",
      name: "Property annual inspection",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-05-27T10:00:00Z"),
      description:
        "Attend the annual inspection.",
      priority: "Medium",
    });
    await TaskCollection.insertAsync({
      _id: "6",
      name: "Sign rental agreement",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-05-27T10:00:00Z"),
      description:
        "Sign the rental agreement which has had the rent increased by 5%.",
      priority: "Medium",
    });

    console.log("Tasks seeded successfully.");
  }

  // Update the task_ids field for Agent, Tenant, and Landlord
  if (globalAgent) {
    await AgentCollection.updateAsync(
      { _id: globalAgent.agentId }, // Find the agent by ID
      { $set: { task_ids: ["1", "2"] } } // Assign task IDs
    );
    console.log("Assigned tasks to Agent:", globalAgent.agentId);
  }

  if (globalTenant) {
    await TenantCollection.updateAsync(
      { _id: globalTenant.tenantId }, // Find the tenant by ID
      { $set: { task_ids: ["5", "6"] } } // Assign task IDs
    );
    console.log("Assigned tasks to Tenant:", globalTenant.tenantId);
  }

  if (globalLandlord) {
    await LandlordCollection.updateAsync(
      { _id: globalLandlord.landlordId }, // Find the landlord by ID
      { $set: { task_ids: ["3", "4"] } } // Assign task IDs
    );
    console.log("Assigned tasks to Landlord:", globalLandlord.landlordId);
  }
}


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