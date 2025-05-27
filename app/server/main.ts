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
  // await tempSeedPropertyStatusData();
  await permSeedListingStatusData();
  await seedListedProperties(globalAgent, globalLandlord, globalTenant);
});

async function tempSeedUserAndRoleData(): Promise<void> {
  const seedUsers = [
    {
      email: "amandaapplebe@gmail.com",
      password: "password123",
      firstName: "Amanda",
      lastName: "Applebe",
      accountType: Role.AGENT,
      agentCode: "AGENT123",
    },
    {
      email: "toddtoolgate@gmail.com",
      password: "password123",
      firstName: "Todd",
      lastName: "Toolgate",
      accountType: Role.TENANT,
    },
    {
      email: "lewislad@gmail.com",
      password: "password123",
      firstName: "Lewis",
      lastName: "Lad",
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
      { _id: "6", name: PropertyStatus.LISTED },
    ];

    // Add new status if it doesn't exist
    for (const status of statuses) {
      const existingStatus = await PropertyStatusCollection.findOneAsync({
        _id: status._id,
      });
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
    "https://images.unsplash.com/photo-1611420890968-c87853bfa973?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1682889762731-375a6b22d794?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1677474827615-31ea6fa13efe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1568391300292-a5a1d96b82aa?q=80&w=1928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1631048501851-4aa85ffc3be8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1582224163312-0735047647c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1521783988139-89397d761dce?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661902468735-eabf780f8ff6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1681487208776-e308bfaa0539?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1673141390230-8b4a3c3152b1?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661963333824-fd020faec5fc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1687960116506-f31f84371838?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1644847266252-14cb37a48371?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1654291271293-ab9cb83208ce?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1610295186968-7ad29a75199e?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

  // Array of 20 different image URLs for the property listings
  const imageUrlsPool = [
    "https://images.unsplash.com/photo-1611420890968-c87853bfa973?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1682889762731-375a6b22d794?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1677474827615-31ea6fa13efe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1568391300292-a5a1d96b82aa?q=80&w=1928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1631048501851-4aa85ffc3be8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1582224163312-0735047647c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1521783988139-89397d761dce?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661902468735-eabf780f8ff6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1681487208776-e308bfaa0539?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1673141390230-8b4a3c3152b1?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661963333824-fd020faec5fc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1687960116506-f31f84371838?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1644847266252-14cb37a48371?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1654291271293-ab9cb83208ce?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1610295186968-7ad29a75199e?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  // Helper function to get 3 random unique URLs
  function getRandomImageUrls(): string[] {
    const shuffled = [...imageUrlsPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3); // Select the first 3 URLs
  }

  // Properties to seed
  const properties = [
    {
      _id: "4",
      streetnumber: "40",
      streetname: "Reno Street",
      suburb: "Clayton",
      province: "VIC",
      postcode: "3191",
      property_status_id: propertyStatusVacantId,
      description:
        "Spacious 2-bedroom property in a prime location. Features modern amenities and excellent transport links. Ideal for families or professionals looking for comfort and convenience. Property includes a well-maintained garden and off-street parking.",
      summary_description: "Beautiful 2-bed property in Clayton.",
      bathrooms: 4,
      bedrooms: 7,
      parking: 6,
      property_feature_ids: defaultFeatureIds,
      type: "House",
      area: 320,
      agent_id: agent?.agentId,
      landlord_id: landlord?.landlordId,
      tenant_id: tenant?.tenantId,
    },
    {
      _id: "5",
      streetnumber: "50",
      streetname: "Developer Street",
      suburb: "Frankston",
      province: "VIC",
      postcode: "3188",
      property_status_id: propertyStatusVacantId,
      description:
        "Spacious 3-bedroom property in a prime location. Features modern amenities and excellent transport links. Ideal for families or professionals looking for comfort and convenience. Property includes a well-maintained garden and off-street parking.",
      summary_description: "Beautiful 3-bed property in Frankston.",
      bathrooms: 2,
      bedrooms: 3,
      parking: 2,
      property_feature_ids: defaultFeatureIds,
      type: "Townhouse",
      area: 340,
      agent_id: agent?.agentId,
      landlord_id: landlord?.landlordId,
      tenant_id: tenant?.tenantId,
    },
    {
      _id: "6",
      streetnumber: "60",
      streetname: "Present Court",
      suburb: "Cranbourne",
      province: "VIC",
      postcode: "3111",
      property_status_id: propertyStatusVacantId,
      description:
        "Spacious 4-bedroom property in a prime location. Features modern amenities and excellent transport links. Ideal for families or professionals looking for comfort and convenience. Property includes a well-maintained garden and off-street parking.",
      summary_description: "Beautiful 4-bed property in Cranbourne.",
      bathrooms: 3,
      bedrooms: 4,
      parking: 2,
      property_feature_ids: defaultFeatureIds,
      type: "House",
      area: 360,
      agent_id: agent?.agentId,
      landlord_id: landlord?.landlordId,
      tenant_id: tenant?.tenantId,
    },
    {
      _id: "7",
      streetnumber: "70",
      streetname: "Central Street",
      suburb: "Bayswater",
      province: "VIC",
      postcode: "4441",
      property_status_id: propertyStatusVacantId,
      description:
        "Spacious 2-bedroom property in a prime location. Features modern amenities and excellent transport links. Ideal for families or professionals looking for comfort and convenience. Property includes a well-maintained garden and off-street parking.",
      summary_description: "Beautiful 2-bed property in Bayswater.",
      bathrooms: 1,
      bedrooms: 2,
      parking: 1,
      property_feature_ids: defaultFeatureIds,
      type: "Apartment",
      area: 380,
      agent_id: agent?.agentId,
      landlord_id: landlord?.landlordId,
      tenant_id: tenant?.tenantId,
    },
    {
      _id: "8",
      streetnumber: "80",
      streetname: "New Street",
      suburb: "Melbourne",
      province: "VIC",
      postcode: "3000",
      property_status_id: propertyStatusVacantId,
      description:
        "Modern 1-bedroom apartment in the heart of the city. Close to amenities and public transport.",
      summary_description: "Chic 1-bed apartment in Melbourne.",
      bathrooms: 1,
      bedrooms: 1,
      parking: 0,
      property_feature_ids: defaultFeatureIds,
      type: "Apartment",
      area: 50,
      agent_id: agent?.agentId,
      landlord_id: landlord?.landlordId,
      tenant_id: tenant?.tenantId,
    },
    {
      _id: "9",
      streetnumber: "90",
      streetname: "Ocean View Road",
      suburb: "Geelong",
      province: "VIC",
      postcode: "3220",
      property_status_id: propertyStatusVacantId,
      description:
        "Luxurious 5-bedroom house with stunning ocean views. Features a private pool and spacious garden.",
      summary_description: "Luxury 5-bed house in Geelong.",
      bathrooms: 4,
      bedrooms: 5,
      parking: 3,
      property_feature_ids: defaultFeatureIds,
      type: "House",
      area: 500,
      agent_id: agent?.agentId,
      landlord_id: landlord?.landlordId,
      tenant_id: tenant?.tenantId,
    },
    {
      _id: "10",
      streetnumber: "100",
      streetname: "Hilltop Avenue",
      suburb: "Ballarat",
      province: "VIC",
      postcode: "3350",
      property_status_id: propertyStatusVacantId,
      description:
        "Charming 3-bedroom cottage with a cozy fireplace and large backyard. Perfect for families.",
      summary_description: "Charming 3-bed cottage in Ballarat.",
      bathrooms: 2,
      bedrooms: 3,
      parking: 2,
      property_feature_ids: defaultFeatureIds,
      type: "Cottage",
      area: 200,
      agent_id: agent?.agentId,
      landlord_id: landlord?.landlordId,
      tenant_id: tenant?.tenantId,
    },
    {
      _id: "11",
      streetnumber: "110",
      streetname: "Riverbank Street",
      suburb: "Werribee",
      province: "VIC",
      postcode: "3030",
      property_status_id: propertyStatusVacantId,
      description:
        "Stylish 2-bedroom apartment with modern finishes and a balcony overlooking the river.",
      summary_description: "Stylish 2-bed apartment in Werribee.",
      bathrooms: 1,
      bedrooms: 2,
      parking: 1,
      property_feature_ids: defaultFeatureIds,
      type: "Apartment",
      area: 120,
      agent_id: agent?.agentId,
      landlord_id: landlord?.landlordId,
      tenant_id: tenant?.tenantId,
    },
    {
      _id: "12",
      streetnumber: "120",
      streetname: "Forest Lane",
      suburb: "Dandenong",
      province: "VIC",
      postcode: "3175",
      property_status_id: propertyStatusVacantId,
      description:
        "Spacious 4-bedroom family home with a large garden and double garage. Close to schools and parks.",
      summary_description: "Spacious 4-bed home in Dandenong.",
      bathrooms: 3,
      bedrooms: 4,
      parking: 2,
      property_feature_ids: defaultFeatureIds,
      type: "House",
      area: 400,
      agent_id: agent?.agentId,
      landlord_id: landlord?.landlordId,
      tenant_id: tenant?.tenantId,
    },
    {
      _id: "13",
      streetnumber: "130",
      streetname: "Sunset Boulevard",
      suburb: "Hobart",
      province: "TAS",
      postcode: "7000",
      property_status_id: propertyStatusVacantId,
      description:
        "Elegant 3-bedroom townhouse with modern amenities and a private courtyard. Ideal for professionals.",
      summary_description: "Elegant 3-bed townhouse in Hobart.",
      bathrooms: 2,
      bedrooms: 3,
      parking: 1,
      property_feature_ids: defaultFeatureIds,
      type: "Townhouse",
      area: 250,
      agent_id: agent?.agentId,
      landlord_id: landlord?.landlordId,
      tenant_id: tenant?.tenantId,
    },
    // Add more properties here up to 13
  ];

  // Insert each property
  for (const property of properties) {
    const existingProperty = await PropertyCollection.findOneAsync({
      _id: property._id,
    });
    if (existingProperty) {
      console.log(
        `[Seed] Skipped inserting existing property in PropertyCollection: ${property._id}`
      );
      continue;
    }

    await PropertyCollection.insertAsync(property);

    await PropertyPriceCollection.insertAsync({
      property_id: property._id,
      price_per_month: 1200 + parseInt(property._id) * 100,
      date_set: new Date(),
    });

    const randomImageUrls = getRandomImageUrls(); // Get 3 random image URLs

    await ListingCollection.insertAsync({
      property_id: property._id,
      listing_status_id: listedStatusId, // "Listed"
      image_urls: randomImageUrls,
      inspection_ids: ["1", "2", "3", "4"],
    });

    console.log(`[Seed] Created listed property: ${property._id}`);
  }
}

// This function is used to seed the database with initial task data
async function tempSeedTaskData(): Promise<void> {
  console.log("Seeding property data...");
  if ((await TaskCollection.find().countAsync()) === 0) {
    // Insert tasks into the TaskCollection
    TaskCollection.insertAsync({
      _id: "1",
      name: "Initial listing meeting",
      taskStatus: TaskStatus.NOTSTARTED,
      createdDate: new Date("2025-04-12T10:00:00Z"),
      dueDate: new Date("2025-05-19T10:00:00Z"),
      description:
        "Meet with the client to discuss the property listing process and gather necessary information.",
      priority: "High",
    });

    TaskCollection.insertAsync({
      _id: "2",
      name: "Submit Rental Application",
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
      description: "Review the list of agent approved candidates and pick one.",
      priority: "Medium",
    });
    await TaskCollection.insertAsync({
      _id: "4",
      name: "Follow-up with client",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-05-27T10:00:00Z"),
      description: "Attend a property listing meeting with agent.",
      priority: "Medium",
    });
    await TaskCollection.insertAsync({
      _id: "5",
      name: "Property annual inspection",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-05-27T10:00:00Z"),
      description: "Attend the annual inspection.",
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
