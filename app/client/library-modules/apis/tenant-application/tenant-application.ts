import { Meteor } from 'meteor/meteor';
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';
import { ApiTenantApplication } from '/app/shared/api-models/tenant/ApiTenantApplication';

export async function apiGetTenantApplicationsByPropertyId(propertyId: string): Promise<ApiTenantApplication[]> {
  try {
    const result = await Meteor.callAsync(MeteorMethodIdentifier.TENANT_APPLICATION_GET_BY_PROPERTY_ID, propertyId);
    return result;
  } catch (error) {
    console.error('Failed to get tenant applications by property ID:', error);
    throw error;
  }
}

export async function apiGetTenantApplicationsByLandlordId(landlordId: string): Promise<ApiTenantApplication[]> {
    try {
      const result = await Meteor.callAsync(MeteorMethodIdentifier.TENANT_APPLICATION_GET_BY_LANDLORD_ID, landlordId);
      return result;
    } catch (error) {
      console.error('Failed to get tenant applications by landlord ID:', error);
      throw error;
    }
  }

  export async function apiInsertTenantApplication(applicationData: {
    propertyId: string;
    applicantName: string;
    agentId: string;
    landlordId: string;
  }): Promise<string> {
    try {
      const result = await Meteor.callAsync(MeteorMethodIdentifier.TENANT_APPLICATION_INSERT, applicationData);
      return result;
    } catch (error) {
      console.error('Failed to insert tenant application:', error);
      throw error;
    }
  }

  export async function apiUpdateTenantApplicationStatus(
    applicationId: string,
    status: string,
    step: number,
    taskId?: string
  ): Promise<void> {
    try {
      await Meteor.callAsync(MeteorMethodIdentifier.TENANT_APPLICATION_UPDATE_STATUS, applicationId, status, step, taskId);
    } catch (error) {
      console.error('Failed to update tenant application status:', error);
      throw error;
    }
  }

  export async function apiUpdateMultipleTenantApplicationStatus(
    applicationIds: string[],
    status: string,
    step: number,
    taskId?: string
  ): Promise<void> {
    try {
      await Meteor.callAsync(MeteorMethodIdentifier.TENANT_APPLICATION_UPDATE_MULTIPLE_STATUS, applicationIds, status, step, taskId);
    } catch (error) {
      console.error('Failed to update multiple tenant application statuses:', error);
      throw error;
    }
  }