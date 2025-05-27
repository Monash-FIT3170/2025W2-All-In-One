import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { PropertyFormData, PropertyInsertData } from "/app/shared/api-models/property/PropertyInsertData";

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
    area: property.area,
    agentId: property.agentId,
    landlordId: property.landlordId,
    tenantId: property.tenantId
  }
}


export function mapPropertyFormDataToInsertData(formData: PropertyFormData) {
  const propertyInsertData: PropertyInsertData = {
    streetnumber: formData.streetnumber,
    streetname: formData.streetname,
    suburb: formData.suburb,
    province: formData.province,
    postcode: formData.postcode,
    property_status_id: formData.property_status_id,
    description: formData.description,
    summary_description: formData.summary_description,
    bathrooms: formData.bathrooms,
    bedrooms: formData.bedrooms,
    parking: formData.parking,
    property_feature_ids: formData.property_feature_ids,
    type: formData.type,
    area: formData.area,
    agent_id: formData.agent_id,
    landlord_id: formData.landlord_id,
    tenant_id: formData.tenant_id,
  };

  return {
    propertyInsertData,
    monthly_rent: formData.monthly_rent,
    images: formData.images,
  };
}