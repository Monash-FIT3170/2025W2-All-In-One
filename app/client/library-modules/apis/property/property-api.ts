import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { PropertyInsertData } from "/app/shared/api-models/property/PropertyInsertData";
import { PropertyUpdateData } from "/app/shared/api-models/property/PropertyUpdateData";
import { Meteor } from "meteor/meteor";

export async function apiGetPropertyById(id: string): Promise<ApiProperty> {
    try {
        const fetchedProperty = await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_GET,
            id
        );
        return fetchedProperty;
    } catch (error) {
        console.error(`Error fetching property with ID ${id}:`, error);
        throw error;
    }
}

export async function apiGetPropertyStatusId(
    name: PropertyStatus
): Promise<string> {
    try {
        return await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_STATUS_GET,
            name
        );
    } catch (error) {
        console.error(`Error fetching property status id for ${name}:`, error);
        throw error;
    }
}

export async function apiInsertProperty(
    property: PropertyInsertData
): Promise<string> {
    try {
        return await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_INSERT,
            property
        );
    } catch (error) {
        console.error("Error inserting property:", error);
        throw error;
    }
}

export async function apiUpdatePropertyData(
    updatedProperty: PropertyUpdateData
): Promise<string> {
    try {
        return await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_DATA_UPDATE,
            updatedProperty
        );
    } catch (error) {
        console.error("Error updating property data:", error);
        throw error;
    }
}

export async function apiGetAllProperties(): Promise<ApiProperty[]> {
    try {
        const fetchedProperties: ApiProperty[] = await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_GET_ALL
        );
        return fetchedProperties;
    } catch (error) {
        console.error("Error fetching all properties:", error);
        throw error;
    }
}

export async function apiGetPropertyByTenantId(
    tenantId: string
): Promise<ApiProperty> {
    try {
        return await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_GET_BY_TENANT_ID,
            tenantId
        );
    } catch (error) {
        console.error(
            `Error fetching property by tenant ID ${tenantId}:`,
            error
        );
        throw error;
    }
}

export async function apiGetPropertyByAgentId(
    agentId: string
): Promise<ApiProperty[]> {
    try {
        return await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_GET_ALL_BY_AGENT_ID,
            agentId
        );
    } catch (error) {
        console.error(
            `Error fetching properties by agent ID ${agentId}:`,
            error
        );
        throw error;
    }
}
export async function apiGetAllPropertiesByLandlordId(
    landlordId: string
): Promise<ApiProperty[]> {
    try {
        return await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_GET_ALL_BY_LANDLORD_ID,
            landlordId
        );
    } catch (error) {
        console.error(
            `Error fetching properties by landlord ID ${landlordId}:`,
            error
        );
        throw error;
    }
}

export async function apiSearchPropertyByQuery(
    query: string
): Promise<ApiProperty[]> {
    try {
        return await Meteor.callAsync(
            MeteorMethodIdentifier.PROPERTY_SEARCH,
            query
        );
    } catch (error) {
        console.error(
            `Error searching properties with query "${query}":`,
            error
        );
        throw error;
    }
}
