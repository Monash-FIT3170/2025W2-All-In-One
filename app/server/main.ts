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
import {
  TaskCollection,
  TaskStatusCollection,
} from "/app/server/database/task/task-collections";
import { TenantCollection } from "/app/server/database/user/user-collections";
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
  await tempSeedPropertyStatusData();
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
      task_ids: ["tenant-task-1", "tenant-task-2", "tenant-task-3"],
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
      if (user.accountType === Role.TENANT) {
        globalTenant = dto;
        const tenant = await TenantCollection.findOneAsync({ userAccountId: existing._id });
        if (tenant && (!tenant.task_ids || tenant.task_ids.length === 0)) {
          await TenantCollection.updateAsync(
            { userAccountId: existing._id },
            { $set: { task_ids: user.task_ids } }
          );
        }
      }
      if (user.accountType === Role.LANDLORD) globalLandlord = dto;
      continue;
    }

    try {
      const { userAccountId } = await Meteor.callAsync(
        MeteorMethodIdentifier.USER_REGISTER,
        user
      );

      if (user.accountType === Role.TENANT) {
        await TenantCollection.updateAsync(
          { userAccountId },
          { $set: { task_ids: user.task_ids } }
        );
      }

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
    await PropertyStatusCollection.insertAsync({
      _id: "1",
      name: PropertyStatus.VACANT,
    });

    await PropertyFeatureCollection.insertAsync({
      _id: "1",
      name: "Pool",
    });
    await PropertyFeatureCollection.insertAsync({
      _id: "2",
      name: "Lots of space",
    });

    await PropertyPriceCollection.insertAsync({
      property_id: "1",
      price_per_month: 1500,
      date_set: new Date(),
    });

    await PropertyCollection.insertAsync({
      _id: "1",
      streetnumber: "123",
      streetname: "Sample St",
      suburb: "Springfield",
      province: "IL",
      postcode: "62704",
      property_status_id: PropertyStatus.VACANT,
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
  // Always clear existing tasks to ensure we get fresh data
  await TaskCollection.removeAsync({});
  await TaskStatusCollection.removeAsync({});

  // Create task statuses
  await TaskStatusCollection.insertAsync({
    _id: "1",
    name: "Not Started",
  });
  await TaskStatusCollection.insertAsync({
    _id: "2",
    name: "In Progress",
  });
  await TaskStatusCollection.insertAsync({
    _id: "3",
    name: "Completed",
  });
  console.log("Created task statuses");

  const tenantTasks = [
    {
      _id: "tenant-task-1",
      name: "Schedule Property Viewing",
      taskStatus: TaskStatus.NOTSTARTED,
      createdDate: new Date("2025-04-12T10:00:00Z"),
      dueDate: new Date("2025-10-26T10:00:00Z"),
      description: "Schedule a viewing for the property at 123 Sample St.",
      priority: "High",
    },
    {
      _id: "tenant-task-2",
      name: "Submit Rental Application",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-14T10:00:00Z"),
      dueDate: new Date("2025-04-21T10:00:00Z"),
      description: "Complete and submit the rental application form with all required documents.",
      priority: "High",
    },
    {
      _id: "tenant-task-3",
      name: "Review Lease Agreement",
      taskStatus: TaskStatus.NOTSTARTED,
      createdDate: new Date("2025-04-16T10:00:00Z"),
      dueDate: new Date("2025-09-23T10:00:00Z"),
      description: "Review the lease agreement terms and conditions before signing.",
      priority: "Medium",
    }
  ];

 
  for (const task of tenantTasks) {
    try {
      await TaskCollection.insertAsync(task);
    } catch (error) {
      console.error(`Error creating task ${task._id}:`, error);
    }
  }
 
}

  async function tempSeedPropertyStatusData(): Promise<void> {
    if ((await PropertyStatusCollection.find().countAsync()) != 2){
      PropertyStatusCollection.insertAsync({
        name: PropertyStatus.VACANT
      })
      PropertyStatusCollection.insertAsync({
        name:PropertyStatus.OCCUPIED
      })
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
