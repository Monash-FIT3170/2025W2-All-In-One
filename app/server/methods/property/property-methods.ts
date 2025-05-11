import { Property } from "/app/server/database/property/models/Property";
import {
  PropertyCollection,
  PropertyFeatureCollection,
  PropertyStatusCollection,
} from "/app/server/database/property/PropertyCollections";
import { PropertyDTO } from "/app/server/methods/property/models/PropertyDTO";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

const propertyGetMethod = {
  [MeteorMethodIdentifier.PROPERTY_GET]: async (
    id: string
  ): Promise<PropertyDTO> => {
    const fetchedPropertyDocument = await PropertyCollection.findOneAsync(id);

    if (!fetchedPropertyDocument) {
      throw new Meteor.Error(`Property with ${id} not found`);
    }

    const propertyDTO = mapPropertyDocumentToPropertyDTO(
      fetchedPropertyDocument
    ).catch((error) => {
      throw new Meteor.Error(error);
    });

    return propertyDTO;
  },
};

async function mapPropertyDocumentToPropertyDTO(
  property: Property
): Promise<PropertyDTO> {
  return new Promise(async (resolve, reject) => {
    const propertyStatus = await PropertyStatusCollection.findOneAsync(
      property.property_status_id
    );
    const propertyFeatures = await PropertyFeatureCollection.find({
      _id: { $in: property.property_feature_ids },
    }).fetchAsync();

    if (!propertyStatus) {
      reject(`Property status for Property id ${property._id} not found`);
    }
    if (propertyFeatures.length !== property.property_feature_ids.length) {
      reject(`Missing property features for Property id ${property._id}.`);
    }

    resolve({
      propertyId: property._id,
      streetnumber: property.streetnumber,
      streetname: property.streetname,
      suburb: property.suburb,
      province: property.province,
      postcode: property.postcode,
      propertyStatus: property.property_status_id, // will need to obtain status from the collection
      description: property.description,
      bathrooms: property.bathrooms,
      bedrooms: property.bedrooms,
      features: property.property_feature_ids, // will need to obtain fetures from the collection
      type: property.type,
      area: property.area,
    });
  });
}

Meteor.methods({
  ...propertyGetMethod,
});
