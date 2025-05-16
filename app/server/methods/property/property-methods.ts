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
import { Property } from "/app/client/library-modules/domain-models/property/Property";

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

async function updateProperty(property: ApiProperty): Promise<void> {
  await PropertyCollection.updateAsync(property.propertyId, {
    $set: {
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
    },
  });
}

Meteor.methods({
  [MeteorMethodIdentifier.PROPERTY_UPDATE]: updateProperty,
});


Meteor.methods({
  ...propertyGetMethod,
  ...updateProperty,
});
