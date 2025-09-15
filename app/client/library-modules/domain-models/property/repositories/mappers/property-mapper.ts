import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { Property } from "/app/client/library-modules/domain-models/property/Property";
import { PropertyInsertData } from "/app/shared/api-models/property/PropertyInsertData";
import { FormSchemaType } from "/app/client/ui-modules/property-form-agent/components/FormSchema";
import { getPropertyStatusId } from "../property-repository";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";

export function mapApiPropertyToProperty(property: ApiProperty): Property {
  return {
    propertyId: property.propertyId,
    streetnumber: property.streetnumber,
    streetname: property.streetname,
    suburb: property.suburb,
    province: property.province,
    postcode: property.postcode,
    apartment_number: property.apartment_number,
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
    tenantId: property.tenantId,
    locationLatitude: property.locationLatitude,
    locationLongitude: property.locationLongitude
  }
}


export async function mapFormSchemaToPropertyInsertData(form: FormSchemaType) {
  const propertyInsertData: PropertyInsertData = {
    streetnumber: form.address_number,
    streetname: form.address,
    suburb: form.suburb,
    province: form.state, // adjust if you have a separate province field
    postcode: form.postal_code,
    apartment_number: form.apartment_number,
    property_status_id: await getPropertyStatusId(PropertyStatus.VACANT), // fill as needed
    description: form.description,
    summary_description: form.summary_description,
    bathrooms: form.bathroom_number,
    bedrooms: form.bedroom_number,
    parking: form.parking_spaces,
    property_feature_ids: form.property_feature_ids,
    type: form.property_type,
    area: form.space,
    agent_id: form.agent,
    landlord_id: form.landlord,
    tenant_id: "", // fill as needed
  };

  return {
    propertyInsertData,
    monthly_rent: form.monthly_rent,
    images: form.images,
  };
}