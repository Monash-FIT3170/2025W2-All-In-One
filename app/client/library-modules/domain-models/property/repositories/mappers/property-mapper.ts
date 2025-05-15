import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { Property } from "/app/client/library-modules/domain-models/property/Property";

export function mapApiPropertyToProperty(property: ApiProperty): Property {
  return {
    propertyId: property.propertyId,
    streetnumber: property.streetnumber,
    streetname: property.streetname,
    suburb: property.suburb,
    province: property.province,
    postcode: property.postcode,
    pricePerMonth: property.pricePerMonth,
    propertyStatus: property.propertyStatus,
    description: property.description,
    summaryDescription: property.summaryDescription,
    bathrooms: property.bathrooms,
    bedrooms: property.bedrooms,
    parking: property.parking,
    features: property.features,
    type: property.type,
    area: property.area
  }
}