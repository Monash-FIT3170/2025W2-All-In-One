import { PropertyDocument } from "../../database/property/models/PropertyDocument";
import {
  PropertyCollection,
  PropertyCoordinatesCollection,
  PropertyFeatureCollection,
  PropertyPriceCollection,
  PropertyStatusCollection,
} from "../../database/property/property-collections";
import { PropertyFeatureDocument } from "/app/server/database/property/models/PropertyFeatureDocument";
import { PropertyPriceDocument } from "/app/server/database/property/models/PropertyPriceDocument";
import { PropertyStatusDocument } from "/app/server/database/property/models/PropertyStatusDocument";
import { InvalidDataError } from "/app/server/errors/InvalidDataError";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { meteorWrappedInvalidDataError } from "/app/server/utils/error-utils";
import { ApiProperty } from "../../../shared/api-models/property/ApiProperty";
import { AgentDocument } from "../../database/user/models/role-models/AgentDocument";
import { LandlordDocument } from "../../database/user/models/role-models/LandlordDocument";
import { TenantDocument } from "../../database/user/models/role-models/TenantDocument";
import {
  AgentCollection,
  TenantCollection,
} from "../../database/user/user-collections";
import { LandlordCollection } from "../../database/user/user-collections";
import { PropertyInsertData } from "/app/shared/api-models/property/PropertyInsertData";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { PropertyUpdateData } from "/app/shared/api-models/property/PropertyUpdateData";
import { PropertyCoordinateDocument } from "../../database/property/models/PropertyCoordinateDocument";
import { getGeocode } from "../../repositories/geocode/GeocodeRepository";
import { Geocode } from "../../repositories/geocode/models/Geocode";
import { ApiLandlordDashboard } from "/app/shared/api-models/landlord/ApiLandlordDashboard";
import { ListingCollection } from "../../database/property-listing/listing-collections";

// This method is used to get a property by its ID
// It returns a promise that resolves to an ApiProperty object
// If the property is not found, it throws an InvalidDataError
// If there is an error while mapping the property document to DTO, it throws an InvalidDataError
// The method is wrapped in a Meteor method so it can be called from the client
const propertyGetMethod = {
  [MeteorMethodIdentifier.PROPERTY_GET]: async (
    id: string
  ): Promise<ApiProperty> => {
    const propertyDocument = await getPropertyDocumentById(id);

    if (!propertyDocument) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(`Property with ${id} not found`)
      );
    }

    const propertyDTO = await mapPropertyDocumentToPropertyDTO(
      propertyDocument
    ).catch((error) => {
      throw meteorWrappedInvalidDataError(error);
    });

    return propertyDTO;
  },
};

// This method is used to map a property document to an ApiProperty DTO.
// This function transforms a PropertyDocument (raw database document) into an ApiProperty (structured DTO) for client use. It performs the following steps:
// 1. Fetches the property status document by its ID
// 2. Fetches the latest property price document for the property
// 3. Fetches the property features documents matching the IDs in the property document
// It takes a PropertyDocument as input and returns a promise that resolves to an ApiProperty object
// It fetches the property status, latest property price, and property features documents

const propertyGetAllMethod = {
  [MeteorMethodIdentifier.PROPERTY_GET_ALL]: async (): Promise<
    ApiProperty[]
  > => {
    const propertyDocuments = await PropertyCollection.find({}).fetchAsync();
    const propertyDTOs = await Promise.all(
      propertyDocuments.map((property) =>
        mapPropertyDocumentToPropertyDTO(property)
      )
    );
    return propertyDTOs;
  },
};

const propertyUpdateTenantMethod = {
  [MeteorMethodIdentifier.PROPERTY_TENANT_UPDATE]: async (
    propertyId: string,
    tenantId: string
  ): Promise<void> => {
    try {
      await PropertyCollection.updateAsync(propertyId, {
        $set: {
          tenant_id: tenantId,
        },
      });
    } catch (error) {
      console.error("Error in propertyUpdateTenantMethod:", error);
      throw meteorWrappedInvalidDataError(error as InvalidDataError);
    }
  },
};

async function mapPropertyDocumentToPropertyDTO(
  property: PropertyDocument
): Promise<ApiProperty> {
  const propertyStatusDocument = await getPropertyStatusDocumentById(
    property.property_status_id
  );
  const propertyPriceDocument = await getLatestPropertyPriceDocumentForProperty(
    property._id
  );
  const propertyFeaturesDocuments =
    await getPropertyFeatureDocumentsMatchingIds(property.property_feature_ids);
  const propertyCoordinatesDocument = await getPropertyCoordinateDocumentWithId(
    property.property_coordinate_id
  );
  const agentDocument = property.agent_id
    ? await getAgentDocumentById(property.agent_id)
    : null; // Handle missing agent_id gracefully
  const landlordDocument = property.landlord_id
    ? await getLandlordDocumentById(property.landlord_id)
    : null; // Handle missing landlord_id gracefully
  const tenantDocument = property.tenant_id
    ? await getTenantDocumentById(property.tenant_id)
    : null; // Handle missing tenant_id gracefully

  if (!agentDocument) {
    console.warn(`Agent for Property id ${property._id} not found.`);
  }
  if (!landlordDocument) {
    console.warn(`Landlord for Property id ${property._id} not found.`);
  }
  //Check if I need this, as I we don't necessarily need a tenant for a property
  if (!tenantDocument) {
    console.warn(`Tenant for Property id ${property._id} not found.`);
  }
  if (!propertyStatusDocument) {
    throw new InvalidDataError(
      `Property status for Property id ${property._id} not found.`
    );
  }
  if (!propertyPriceDocument) {
    throw new InvalidDataError(
      `Property price for Property id ${property._id} not found.`
    );
  }
  if (
    propertyFeaturesDocuments.length !== property.property_feature_ids.length
  ) {
    throw new InvalidDataError(
      `Missing property features for Property id ${property._id}.`
    );
  }
  if (!propertyCoordinatesDocument) {
    throw new InvalidDataError(
      `Property coordinates for Property id ${property._id} not found.`
    );
  }

  return {
    propertyId: property._id,
    streetnumber: property.streetnumber,
    streetname: property.streetname,
    suburb: property.suburb,
    province: property.province,
    postcode: property.postcode,
    apartment_number: property.apartment_number,
    pricePerMonth: propertyPriceDocument.price_per_month,
    propertyStatus: propertyStatusDocument.name,
    description: property.description,
    summaryDescription: property.summary_description,
    bathrooms: property.bathrooms,
    bedrooms: property.bedrooms,
    parking: property.parking,
    features: propertyFeaturesDocuments.map((doc) => doc.name),
    featureIds: propertyFeaturesDocuments.map((doc) => doc._id),
    type: property.type,
    area: property.area,
    agentId: agentDocument ? agentDocument._id : "", // Always string
    landlordId: landlordDocument ? landlordDocument._id : "", // Always string
    tenantId: tenantDocument ? tenantDocument._id : "", // Always string
    locationLatitude: propertyCoordinatesDocument.latitude,
    locationLongitude: propertyCoordinatesDocument.longitude,
  };
}

async function getPropertyDocumentById(
  id: string
): Promise<PropertyDocument | undefined> {
  return await PropertyCollection.findOneAsync(id);
}

async function getPropertyStatusDocumentById(
  id: string
): Promise<PropertyStatusDocument | undefined> {
  return await PropertyStatusCollection.findOneAsync(id);
}

async function getPropertyFeatureDocumentsMatchingIds(
  ids: string[]
): Promise<PropertyFeatureDocument[]> {
  return await PropertyFeatureCollection.find({
    _id: { $in: ids },
  }).fetchAsync();
}

async function getPropertyCoordinateDocumentWithId(
  documentId: string
): Promise<PropertyCoordinateDocument | undefined> {
  return await PropertyCoordinatesCollection.findOneAsync(documentId);
}

async function getLatestPropertyPriceDocumentForProperty(
  propertyId: string
): Promise<PropertyPriceDocument | undefined> {
  return await PropertyPriceCollection.findOneAsync(
    { property_id: propertyId },
    { sort: { date_set: -1 } }
  );
}

async function getAgentDocumentById(
  id: string
): Promise<AgentDocument | undefined> {
  return await AgentCollection.findOneAsync(id);
}
async function getLandlordDocumentById(
  id: string
): Promise<LandlordDocument | undefined> {
  return await LandlordCollection.findOneAsync(id);
}
async function getTenantDocumentById(
  id: string
): Promise<TenantDocument | undefined> {
  return await TenantCollection.findOneAsync(id);
}

const propertyInsertMethod = {
  [MeteorMethodIdentifier.PROPERTY_INSERT]: async (
    data: PropertyInsertData
  ): Promise<string> => {
    try {
      const geocode = await getGeocode(getAddressFromPropertyInsertData(data));
      const newCoordinatesId =
        await insertGeocodeIntoCoordinatesCollection(geocode);

      const propertyId = await PropertyCollection.insertAsync({
        property_coordinate_id: newCoordinatesId,
        ...data,
      });

      return propertyId;
    } catch (error) {
      console.error("Failed to insert property:", error);
      throw meteorWrappedInvalidDataError(error as InvalidDataError);
    }
  },
};

function getAddressFromPropertyInsertData(data: PropertyInsertData): string {
  return `${data.streetnumber} ${data.streetname}, ${data.suburb}, ${data.province}`;
}

function insertGeocodeIntoCoordinatesCollection(
  geocode: Geocode
): Promise<string> {
  return PropertyCoordinatesCollection.insertAsync({
    latitude: geocode.latitude,
    longitude: geocode.longitude,
  });
}

const propertyGetByTenantIdMethod = {
  [MeteorMethodIdentifier.PROPERTY_GET_BY_TENANT_ID]: async (
    tenantId: string
  ): Promise<ApiProperty | null> => {
    try {
      const propertyDocument = await PropertyCollection.findOneAsync({
        tenant_id: tenantId,
      });

      if (!propertyDocument) {
        return null;
      }

      const propertyDTO = await mapPropertyDocumentToPropertyDTO(
        propertyDocument
      ).catch((error) => {
        throw meteorWrappedInvalidDataError(error);
      });

      return propertyDTO;
    } catch (error) {
      console.error("Error in propertyGetByTenantIdMethod:", error);
      throw error;
    }
  },
};

const propertyGetAllByLandlordId = {
  [MeteorMethodIdentifier.PROPERTY_GET_ALL_BY_LANDLORD_ID]: async (
    landlordId: string
  ): Promise<ApiProperty[]> => {
    const properties = await PropertyCollection.find({
      landlord_id: landlordId,
    }).fetchAsync();
    return Promise.all(properties.map(mapPropertyDocumentToPropertyDTO));
  },
};

const propertyGetAllByAgentId = {
  [MeteorMethodIdentifier.PROPERTY_GET_ALL_BY_AGENT_ID]: async (
    agentId: string
  ): Promise<ApiProperty[]> => {
    const properties = await PropertyCollection.find({
      agent_id: agentId,
    }).fetchAsync();
    return Promise.all(properties.map(mapPropertyDocumentToPropertyDTO));
  },
};

const updatePropertyData = {
  [MeteorMethodIdentifier.PROPERTY_DATA_UPDATE]: async (
    property: PropertyUpdateData
  ): Promise<void> => {
    await PropertyCollection.updateAsync(property.propertyId, {
      $set: {
        apartment_number: property.apartment_number,
        streetnumber: property.streetnumber,
        streetname: property.streetname,
        suburb: property.suburb,
        province: property.province,
        postcode: property.postcode,
        description: property.description,
        summary_description: property.summaryDescription,
        bathrooms: property.bathrooms,
        bedrooms: property.bedrooms,
        parking: property.parking,
        features: property.features,
        type: property.type,
        area: property.area,
        landlord_id: property.landlordId,
      },
    });
  },
};

// This method is used to search for properties based on a query given by the user
// It breaks up the query into tokens such as "Cranbourne VIC 3977" becomes ["Cranbourne", "VIC", "3977"]
// It then uses the tokens to search for vacant properties in the database
// It returns an array of ApiProperty DTOs
// If there is an error, it throws an InvalidDataError
// The method is wrapped in a Meteor method so it can be called from the client

const propertySearchMethod = {
  //
  [MeteorMethodIdentifier.PROPERTY_SEARCH]: async (
    query: string // query string to search for properties
  ): Promise<ApiProperty[]> => {
    try {
      // trims and lowercases the query to ensure consistent matching
      const cleanedQuery = query
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, " ");
      if (!cleanedQuery) return [];

      // splits the query into multiple tokens i.e "Cranbourne VIC 3977" becomes
      // ["Cranbourne", "VIC", "3977"]
      const tokens = cleanedQuery.split(/\s+/);

      // maps the regex tokens to a MongoDB query
      const mongoQuery = {
        $and: tokens.map((token) => ({
          $or: [
            { suburb: { $regex: token, $options: "i" } },
            { postcode: { $regex: token, $options: "i" } },
            { streetname: { $regex: token, $options: "i" } },
            { province: { $regex: token, $options: "i" } },
          ],
        })),
      };

      // finds properties matching the query in suburb, postcode, or streetname
      const matchingProperties =
        await PropertyCollection.find(mongoQuery).fetchAsync();

      const vacantProperties = matchingProperties.filter(
        (property) => property.property_status_id === "1" // 1 is the ID for the seeded vacant
      );

      //Collect the listed properties with a "DRAFT" stauts
      const propertyIds = vacantProperties.map((p) => p._id);

      const listings = await ListingCollection.find({
        property_id: { $in: propertyIds },
      }).fetchAsync();

      // Create a set of propertyIds that are in draft
      const listedPropertyIds = new Set(
        listings
          .filter((l) => l.listing_status_id === "2")
          .map((l) => l.property_id)
      );

      const listedAndVacant = vacantProperties.filter((p) =>
        listedPropertyIds.has(p._id)
      );

      // Map the matching properties to ApiProperty DTOs
      const dtoResults = await Promise.all(
        listedAndVacant.map(mapPropertyDocumentToPropertyDTO)
      );

      return dtoResults;
    } catch (error) {
      console.error("Error in propertySearchMethod:", error);
      throw meteorWrappedInvalidDataError(error as InvalidDataError);
    }
  },
};

const getLandlordDashboardMethod = {
  [MeteorMethodIdentifier.GET_LANDLORD_DASHBOARD]: async (
    landlordId: string
  ): Promise<ApiLandlordDashboard> => {
    const [occupiedId, vacantId] = await Promise.all([
      Meteor.callAsync(
        MeteorMethodIdentifier.PROPERTY_STATUS_GET,
        PropertyStatus.OCCUPIED
      ),
      Meteor.callAsync(
        MeteorMethodIdentifier.PROPERTY_STATUS_GET,
        PropertyStatus.VACANT
      ),
    ]);

    const allProperties = await PropertyCollection.find({
      landlord_id: landlordId,
    }).fetchAsync();

    const totalProperties = allProperties.length;

    const occupiedProperties = allProperties.filter(
      (p) => p.property_status_id === occupiedId
    );
    const vacantProperties = allProperties.filter(
      (p) => p.property_status_id === vacantId
    );

    const occupiedCount = occupiedProperties.length;
    const vacantCount = vacantProperties.length;

    const pricePromises = occupiedProperties.map((p) =>
      PropertyPriceCollection.findOneAsync(
        { property_id: p._id },
        { sort: { date_set: -1 } } //uses most recent date for rent
      )
    );

    const latestPrices = (await Promise.all(pricePromises)).filter(Boolean);
    const totalMonthly = latestPrices.reduce(
      (sum, price) => sum + price!.price_per_month,
      0
    );

    const totalWeekly = totalMonthly * (12 / 52);
    const averageRent = occupiedCount > 0 ? totalMonthly / occupiedCount : 0;
    const occupancyRate =
      totalProperties > 0 ? (occupiedCount / totalProperties) * 100 : 0;

    return {
      totalPropertyCount: totalProperties,
      propertyStatusCounts: {
        occupied: occupiedCount,
        vacant: vacantCount,
      },
      totalIncome: {
        weekly: Math.round(totalWeekly * 100) / 100,
        monthly: Math.round(totalMonthly * 100) / 100,
      },
      occupancyRate: Math.round(occupancyRate),
      averageRent: {
        occupiedCount,
        rent: Math.round(averageRent * 100) / 100,
      },
    };
  },
};

Meteor.methods({
  ...propertyGetMethod,
  ...propertyInsertMethod,
  ...propertyGetAllByAgentId,
  ...propertyInsertMethod,
  ...propertyGetByTenantIdMethod,
  ...propertyGetAllByLandlordId,
  ...updatePropertyData,
  ...propertyUpdateTenantMethod,
  ...getLandlordDashboardMethod,
  ...propertyGetAllMethod,
  ...propertySearchMethod,
});
