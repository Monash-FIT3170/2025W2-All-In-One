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
    await InspectionCollection.insertAsync({
      _id: "3",
      starttime: new Date("2026-04-14T10:00:00Z"),
      endtime: new Date("2026-04-15T11:00:00Z"),
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

    // Seed 10 additional properties with "Listed" status
    const listedStatusId = "2"; // Corresponds to ListingStatus.LISTED 
    const propertyStatusVacantId = "1"; // Corresponds to "Vacant"
    const defaultFeatureIds = ["1", "2"]; // Default features

    for (let i = 2; i <= 11; i++) {
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
          `Spacious ${ (i % 3) + 2}-bedroom property in a prime location. Features modern amenities and excellent transport links. ` +
          `Ideal for families or professionals looking for comfort and convenience. Property includes a well-maintained garden and off-street parking.`,
        summary_description: `Beautiful ${ (i % 3) + 2}-bed property in ${["Clayton", "Frankston", "Cranbourne", "Mexico"][i % 4]}.`,
        bathrooms: (i % 2) + 1,
        bedrooms: (i % 3) + 2,
        parking: (i % 2) + 1,
        property_feature_ids: defaultFeatureIds,
        type: (i % 2 === 0) ? "Apartment" : "Townhouse",
        area: 300 + i * 20,
        agent_id: globalAgent?.agentId,
        landlord_id: globalLandlord?.landlordId,
        tenant_id: globalTenant.tenantId
      });

      await PropertyPriceCollection.insertAsync({
        property_id: propertyId,
        price_per_month: 1200 + i * 100,
        date_set: new Date(),
      });

      
      // // Generate some random image URLs for variety
      // const imageUrls = [
      //   `https://picsum.photos/seed/${propertyId}_1/800/600`,
      //   `https://picsum.photos/seed/${propertyId}_2/800/600`,
      //   `https://picsum.photos/seed/${propertyId}_3/800/600`,
      // ];
      const imageUrls = [
        "https://cdn.pixabay.com/photo/2018/08/04/11/30/draw-3583548_1280.png",
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
        "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
      ];


      await ListingCollection.insertAsync({
        property_id: propertyId,
        listing_status_id: listedStatusId, // "Listed"
        image_urls: imageUrls,
        inspection_ids: ["1","2","3"],
      });
      console.log(`[Seed] Created listed property: ${propertyId}`);
    }
  }
}
async function tempSeedTaskData(): Promise<void> {
  if ((await TaskCollection.find().countAsync()) === 0) {
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

    await TaskCollection.insertAsync({
      _id: "1",
      name: "Initial listing meeting",
      taskStatus: TaskStatus.NOTSTARTED,
      createdDate: new Date("2025-04-12T10:00:00Z"),
      dueDate: new Date("2025-04-19T10:00:00Z"),
      description:
        "Meet with the client to discuss the property listing process and gather necessary information.",
      priority: "High",
    });
    await TaskCollection.insertAsync({
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
