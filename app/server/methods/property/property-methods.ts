import { Property } from "/app/server/database/property/models/Property";
import {
  PropertyCollection,
  PropertyFeatureCollection,
  PropertyStatusCollection,
} from "/app/server/database/property/PropertyCollections";
import { InvalidDataError } from "/app/server/errors/InvalidDataError";
import { PropertyDTO } from "/app/server/methods/property/models/PropertyDTO";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

const propertyGetMethod = {
  [MeteorMethodIdentifier.PROPERTY_GET]: async (
    id: string
  ): Promise<PropertyDTO> => {
    const fetchedPropertyDocument = await PropertyCollection.findOneAsync(id);

    if (!fetchedPropertyDocument) {
      throw new Meteor.Error("NotFound", `Property with ${id} not found`);
    }

    const propertyDTO = mapPropertyDocumentToPropertyDTO(
      fetchedPropertyDocument
    ).catch((error) => {
      throw new Meteor.Error(error.name, error.message);
    });

    return propertyDTO;
  },
};

async function mapPropertyDocumentToPropertyDTO(
  property: Property
): Promise<PropertyDTO> {
  const propertyStatusDocument = await PropertyStatusCollection.findOneAsync(
    property.property_status_id
  );
  const propertyFeaturesDocuments = await PropertyFeatureCollection.find({
    _id: { $in: property.property_feature_ids },
  }).fetchAsync();

  if (!propertyStatusDocument) {
    throw new InvalidDataError(
      `Property status for Property id ${property._id} not found.`
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
    propertyStatus: propertyStatusDocument.name,
    description: property.description,
    bathrooms: property.bathrooms,
    bedrooms: property.bedrooms,
    features: propertyFeaturesDocuments.map((doc) => doc.name),
    type: property.type,
    area: property.area,
  };
}

Meteor.methods({
  ...propertyGetMethod,
});
