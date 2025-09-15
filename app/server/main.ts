import { Meteor } from "meteor/meteor";
import "./methods/azure/blob-methods";
import "./methods/task/task-methods";
import "./methods/property/property-methods";
import "./methods/messaging/messaging-methods";
import "./publications/messaging-publications";
import "./methods/property-listing/listing-methods";
import "./methods/user-documents/lease-agreement-methods";
import "./methods/tenant-application/tenant-application-method";

import {
  PropertyCollection,
  PropertyCoordinatesCollection,
  PropertyFeatureCollection,
  PropertyPriceCollection,
  PropertyStatusCollection,
} from "./database/property/property-collections";
import {
  PropertyListingInspectionCollection,
  ListingCollection,
  ListingStatusCollection,
} from "/app/server/database/property-listing/listing-collections";
import "/app/server/methods/property-status/property-status-methods";
import "/app/server/methods/property-price/property-price-methods";
import "./methods/user/user.register";
import "./methods/user/profile-data-methods";
import "./methods/user/user-account-methods";
import "./methods/user/role-methods/agent-methods";
import "./methods/user/role-methods/tenant-methods";
import "./methods/user/role-methods/landlord-methods";
import { TaskCollection } from "/app/server/database/task/task-collections";
import {
  AgentCollection,
  UserAccountCollection,
} from "/app/server/database/user/user-collections";
import { TenantApplicationCollection } from "./database/tenant/collections/TenantApplicationCollection";
import { TenantCollection } from "./database/user/user-collections";
import { Role } from "../shared/user-role-identifier";
import { TaskStatus } from "../shared/task-status-identifier";
import { MeteorMethodIdentifier } from "../shared/meteor-method-identifier";
import { ApiAgent } from "../shared/api-models/user/api-roles/ApiAgent";
import { ApiTenant } from "../shared/api-models/user/api-roles/ApiTenant";
import { ApiLandlord } from "../shared/api-models/user/api-roles/ApiLandlord";
import {
  LandlordCollection,
  ProfileCollection,
} from "./database/user/user-collections";
import { PropertyStatus } from "../shared/api-models/property/PropertyStatus";
import "/app/server/methods/property/property-features/property-features-methods";
import { ListingStatus } from "../shared/api-models/property-listing/ListingStatus";
import { PropertyDocument } from "./database/property/models/PropertyDocument";
import { LeaseAgreementCollection } from "./database/user-documents/user-documents-collections";
import { TaskPriority } from "../shared/task-priority-identifier";
let globalAgent: ApiAgent;
let globalTenant: ApiTenant;
let globalLandlord: ApiLandlord;

Meteor.startup(async () => {
  await removeTenantApplicationsData();

  await removeAllCollections();
  // await tempSeedPropertyStatusData();
  await permSeedListingStatusData();
  await tempSeedUserAndRoleData();
  await permSeedPropertyFeaturesData();
  // await tempSeedPropertyData();
  await tempSeedTaskData();
  await tempSeedProfileData();
  await tempSeedUserAndRoleData();
  await tempSeedTaskData();
  await seedPropertyCoordinatesForTempProperties();
  await seedListedProperties(globalAgent, globalLandlord, globalTenant);
  await seedLeaseAgreements(globalAgent);
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

async function seedPropertyCoordinatesForTempProperties(): Promise<void> {
  const coordinates = [
    { _id: "1", latitude: -37.8136, longitude: 144.9631 }, // Melbourne
    { _id: "2", latitude: -33.8688, longitude: 151.2093 }, // Sydney
    { _id: "3", latitude: -27.4698, longitude: 153.0251 }, // Brisbane
    { _id: "4", latitude: -37.8761, longitude: 145.1643 }, // Glen waverley
    { _id: "5", latitude: -34.9285, longitude: 138.6007 }, // Adelaide
    { _id: "6", latitude: -31.9505, longitude: 115.8605 }, // Perth
    { _id: "7", latitude: -35.2809, longitude: 149.13 }, // Canberra
    { _id: "8", latitude: -12.4634, longitude: 130.8456 }, // Darwin
    { _id: "9", latitude: -33.8688, longitude: 151.2093 }, // Sydney
    { _id: "10", latitude: -37.892, longitude: 145.178 }, // Wheelers Hill
    { _id: "11", latitude: -38.0051, longitude: 145.1163 }, // Braeside
    { _id: "12", latitude: -37.9572, longitude: 145.0903 }, // Clarinda
    { _id: "13", latitude: -37.9863, longitude: 145.1274 }, // Dingley Village
    { _id: "14", latitude: -37.915, longitude: 145.1287 }, // Clayton
  ];

  for (const coord of coordinates) {
    const existing = await PropertyCoordinatesCollection.findOneAsync({
      _id: coord._id,
    });
    if (!existing) {
      await PropertyCoordinatesCollection.insertAsync(coord);
      console.log(`[Seed] Inserted coordinate for property ID ${coord._id}`);
    }
  }
}

async function tempSeedProfileData(): Promise<void> {
  if ((await ProfileCollection.find().countAsync()) === 0) {
    ProfileCollection.insertAsync({
      _id: "1",
      firstName: "Steve",
      lastName: "Minecraft",
      email: "steve123456@gmail.com",
      dob: "12/05/2025",
      occupation: "Miner",
      phone: "0432 555 222",
      emergencyContact: "Alex",
      employer: "The Mines",
      workAddress: "Jungle Biome",
      workPhone: "0122 222 123",
      profilePicture: "img.com",
    });
  }
  if ((await PropertyCollection.find().countAsync()) === 0) {
    console.log("Seeding Property Data");
    // Seed property statuses first
    const statuses = [
      { _id: "1", name: PropertyStatus.VACANT },
      { _id: "2", name: PropertyStatus.OCCUPIED },
      { _id: "3", name: PropertyStatus.VACANT },
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

  async function seedProperties(): Promise<void> {
    // Properties to seed
    const properties: Array<PropertyDocument> = [
      {
        _id: "1",
        streetnumber: "23",
        streetname: "Spring St",
        suburb: "Glen Waverley",
        province: "VIC",
        postcode: "3196",
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
        property_coordinate_id: "1",
      },
      {
        _id: "2",
        streetnumber: "598",
        streetname: "Heatherton Road",
        suburb: "Noble Park",
        province: "VIC",
        postcode: "3174",
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
        property_coordinate_id: "2",
      },
      {
        _id: "3",
        streetnumber: "23",
        streetname: "Pine Rd",
        suburb: "Clayton",
        province: "VIC",
        postcode: "3168",
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
        property_coordinate_id: "3",
      },
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
        property_coordinate_id: "4",
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
        property_coordinate_id: "5",
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
        property_coordinate_id: "6",
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
        property_coordinate_id: "7",
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
        property_coordinate_id: "8",
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
        property_coordinate_id: "9",
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
        property_coordinate_id: "10",
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
        property_coordinate_id: "11",
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
        property_coordinate_id: "12",
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
        property_coordinate_id: "13",
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
      function getRandomInspectionIds() {
        const allIds = ["1", "2", "3", "4"];
        return allIds
          .sort(() => Math.random() - 0.5) // shuffle
          .slice(0, 2); // pick first 2
      }

      await ListingCollection.insertAsync({
        property_id: property._id,
        listing_status_id: listedStatusId, // "Listed"
        image_urls: randomImageUrls,
        inspection_ids: getRandomInspectionIds(),
      });

      console.log(`[Seed] Created listed property: ${property._id}`);
    }
  }

  await PropertyListingInspectionCollection.insertAsync({
    _id: "1",
    starttime: new Date("2025-04-12T10:00:00Z"),
    endtime: new Date("2025-04-13T11:00:00Z"),
    tenant_ids: [tenant?.tenantId],
  });
  await PropertyListingInspectionCollection.insertAsync({
    _id: "2",
    starttime: new Date("2025-04-14T10:00:00Z"),
    endtime: new Date("2025-04-15T11:00:00Z"),
    tenant_ids: [""],
  });

  await PropertyListingInspectionCollection.insertAsync({
    _id: "3",
    starttime: new Date("2025-04-16T10:00:00Z"),
    endtime: new Date("2025-04-17T11:00:00Z"),
    tenant_ids: [""],
  });

  await PropertyListingInspectionCollection.insertAsync({
    _id: "4",
    starttime: new Date("2026-04-16T10:00:00Z"),
    endtime: new Date("2026-04-17T11:00:00Z"),
    tenant_ids: [""],
  });

  await seedProperties();
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
      priority: TaskPriority.HIGH,
      taskPropertyAddress: "",
      taskPropertyId: "",
    });

    TaskCollection.insertAsync({
      _id: "2",
      name: "Submit Rental Application",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-05-27T10:00:00Z"),
      description:
        "Check in with the client to provide updates and address any questions.",
      priority: TaskPriority.MEDIUM,
      taskPropertyAddress: "",
      taskPropertyId: "",
    });
    await TaskCollection.insertAsync({
      _id: "3",
      name: "Select a tenant",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-05-28T10:00:00Z"),
      description: "Review the list of agent approved candidates and pick one.",
      priority: TaskPriority.MEDIUM,
      taskPropertyAddress: "",
      taskPropertyId: "",
    });
    await TaskCollection.insertAsync({
      _id: "4",
      name: "Follow-up with client",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-05-27T10:00:00Z"),
      description: "Attend a property listing meeting with agent.",
      priority: TaskPriority.MEDIUM,
      taskPropertyAddress: "",
      taskPropertyId: "",
    });
    await TaskCollection.insertAsync({
      _id: "5",
      name: "Property annual inspection",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-05-27T10:00:00Z"),
      description: "Attend the annual inspection.",
      priority: TaskPriority.MEDIUM,
      taskPropertyAddress: "",
      taskPropertyId: "",
    });
    await TaskCollection.insertAsync({
      _id: "6",
      name: "Sign rental agreement",
      taskStatus: TaskStatus.INPROGRESS,
      createdDate: new Date("2025-04-20T10:00:00Z"),
      dueDate: new Date("2025-05-27T10:00:00Z"),
      description:
        "Sign the rental agreement which has had the rent increased by 5%.",
      priority: TaskPriority.MEDIUM,
      taskPropertyAddress: "",
      taskPropertyId: "",
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
      name: ListingStatus.CLOSED,
    });
    await ListingStatusCollection.insertAsync({
      _id: "4",
      name: ListingStatus.TENANT_APPROVAL,
    });
  }
}

async function seedLeaseAgreements(agent: ApiAgent): Promise<void> {
  if ((await LeaseAgreementCollection.find().countAsync()) === 0) {
    console.log("Seeding lease agreement data...");

    // Create a sample lease agreement for Amanda (the agent)
    // Create multiple sample lease agreements for Amanda (the agent)
    await LeaseAgreementCollection.insertAsync({
      _id: "lease_1",
      propertyId: "1", // 23 Spring St, Glen Waverley
      agentId: agent?.agentId || "",
      uploadedDate: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      documentUrl: "https://example.com/sample-lease-agreement.pdf",
      tenantName: "Todd Toolgate",
      title: "Leaase 1",
    });

    await LeaseAgreementCollection.insertAsync({
      _id: "lease_2",
      propertyId: "2", // 598 Heatherton Road, Noble Park
      agentId: agent?.agentId || "",
      uploadedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      validUntil: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000), // 10 months from now
      documentUrl: "https://example.com/another-lease-agreement.pdf",
      tenantName: "Sarah Johnson",
      title: "Leaase 2",
    });

    await LeaseAgreementCollection.insertAsync({
      _id: "lease_3",
      propertyId: "3", // 23 Pine Rd, Clayton
      agentId: agent?.agentId || "",
      uploadedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      validUntil: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000), // 11.5 months from now
      documentUrl: "https://example.com/third-lease-agreement.pdf",
      tenantName: "Mike Chen",
      title: "Leaase 3",
    });

    // Add a lease agreement specifically for Todd Toolgate (tenant)
    await LeaseAgreementCollection.insertAsync({
      _id: "lease_4",
      propertyId: "1", // 23 Spring St, Glen Waverley (same as lease_1 but for tenant view)
      agentId: agent?.agentId || "",
      uploadedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      validUntil: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000), // 6.5 months from now
      documentUrl: "https://example.com/todd-toolgate-lease.pdf",
      tenantName: "Todd Toolgate",
      title: "Leaase 4",
    });

    console.log("Lease agreement seeded successfully.");
  }
}

async function removeAllCollections(): Promise<void> {
  console.log("Removing all collections...");
  await Meteor.users.removeAsync({});
  await AgentCollection.removeAsync({});
  await LandlordCollection.removeAsync({});
  await TenantCollection.removeAsync({});
  await ProfileCollection.removeAsync({});
  await UserAccountCollection.removeAsync({});
  await PropertyCollection.removeAsync({});
  await PropertyFeatureCollection.removeAsync({});
  await PropertyPriceCollection.removeAsync({});
  await PropertyStatusCollection.removeAsync({});
  await PropertyCoordinatesCollection.removeAsync({});
  await PropertyListingInspectionCollection.removeAsync({});
  await ListingCollection.removeAsync({});
  await ListingStatusCollection.removeAsync({});
  await TaskCollection.removeAsync({});
  await LeaseAgreementCollection.removeAsync({});
}

async function removeTenantApplicationsData(): Promise<void> {
  console.log("Removing tenant applications data...");
  await TenantApplicationCollection.removeAsync({});
  console.log("Tenant applications removed successfully.");
}
async function permSeedPropertyFeaturesData(): Promise<void> {
  const features = [
    { _id: "1", name: "Washing Machine" },
    { _id: "2", name: "Hair Dryer" },
    { _id: "3", name: "Garden" },
    { _id: "4", name: "Air Conditioning" },
    { _id: "5", name: "Heater" },
    { _id: "6", name: "Garage" },
    { _id: "7", name: "Pool" },
  ];

  for (const feature of features) {
    const existing = await PropertyFeatureCollection.findOneAsync({
      _id: feature._id,
    });
    if (!existing) {
      await PropertyFeatureCollection.insertAsync(feature);
      console.log(`[Seed] Inserted feature: ${feature.name}`);
    }
  }
}
