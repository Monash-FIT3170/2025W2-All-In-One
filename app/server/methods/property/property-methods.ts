import { get } from "react-hook-form";
import { PropertyDocument } from "../../database/property/models/PropertyDocument";
import {
  PropertyCollection,
  PropertyFeatureCollection,
  PropertyPriceCollection,
  PropertyStatusCollection,
} from "../../database/property/property-collections";
import { PropertyFeatureDocument } from "/app/server/database/property/models/PropertyFeatureDocument";
import { PropertyPriceDocument } from "/app/server/database/property/models/PropertyPriceDocument";
import { PropertyStatusDocument } from "/app/server/database/property/models/PropertyStatusDocument";
import { InvalidDataError } from "/app/server/errors/InvalidDataError";
import { ApiProperty } from "../../../shared/api-models/property/ApiProperty";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { meteorWrappedInvalidDataError } from "/app/server/utils/error-utils";
import { AgentDocument } from "../../database/user/models/role-models/AgentDocument";
import { LandlordDocument } from "../../database/user/models/role-models/LandlordDocument";
import { TenantDocument } from "../../database/user/models/role-models/TenantDocument";
import { AgentCollection } from "../../database/user/user-collections";
import { LandlordCollection } from "../../database/user/user-collections";
import { TenantCollection } from "../../database/user/user-collections";
import { PropertyInsertData } from "/app/shared/api-models/property/PropertyInsertData";

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

  const AgentDocument = property.agent_id
    ? await getAgentDocumentById(property.agent_id)
    : null; // Handle missing agent_id gracefully

  const LandlordDocument = property.landlord_id
    ? await getLandlordDocumentById(property.landlord_id)
    : null; // Handle missing landlord_id gracefully

  const TenantDocument = property.tenant_id
    ? await getTenantDocumentById(property.tenant_id)
    : null; // Handle missing tenant_id gracefully

    if (!AgentDocument) {
      console.warn(`Agent for Property id ${property._id} not found.`);
    }
    if (!LandlordDocument) {
      console.warn(`Landlord for Property id ${property._id} not found.`);
    }

  //Check if I need this, as I we don't necessarily need a tenant for a property
  if (!TenantDocument) {
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

  return {
    propertyId: property._id,
    streetnumber: property.streetnumber,
    streetname: property.streetname,
    suburb: property.suburb,
    province: property.province,
    postcode: property.postcode,
    pricePerMonth: propertyPriceDocument.price_per_month,
    propertyStatus: propertyStatusDocument.name,
    description: property.description,
    summaryDescription: property.summary_description,
    bathrooms: property.bathrooms,
    bedrooms: property.bedrooms,
    parking: property.parking,
    features: propertyFeaturesDocuments.map((doc) => doc.name),
    type: property.type,
    area: property.area,
    agentId: AgentDocument ? AgentDocument._id : '', // Always string
    landlordId: LandlordDocument ? LandlordDocument._id : '', // Always string
    tenantId: TenantDocument ? TenantDocument._id : '', // Always string
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
    const propertyId = await PropertyCollection.insertAsync({
      ...data,
    });
    return propertyId;
  } catch (error) {
    console.error("Failed to insert property:", error);
    throw meteorWrappedInvalidDataError(error as InvalidDataError);
  }
}
}

Meteor.methods({
  ...propertyGetMethod,
  ...propertyInsertMethod
});
