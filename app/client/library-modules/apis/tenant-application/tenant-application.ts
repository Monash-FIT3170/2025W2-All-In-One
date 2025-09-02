import { Meteor } from 'meteor/meteor';
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';
import { ApiTenantApplication } from '../../../../shared/api-models/tenant-application/ApiTenantApplication';

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

  export async function apiUpdateTenantApplicationStatuses(
    applicationIds: string | string[],
    status: string,
    step: number,
    taskId?: string
  ): Promise<void> {
    try {
      // Convert single ID to array for consistency
      const ids = Array.isArray(applicationIds) ? applicationIds : [applicationIds];

      if (ids.length === 0) {
        throw new Error('No application IDs provided');
      }

      await Meteor.callAsync(MeteorMethodIdentifier.TENANT_APPLICATION_UPDATE_STATUS, ids, status, step, taskId);
    } catch (error) {
      console.error('Failed to update tenant application status(es):', error);
      throw error;
    }
  }

  export async function apiUpdateTenantApplicationLinkedTaskId(
    applicationId: string,
    linkedTaskId: string
  ): Promise<void> {
    try {
      await Meteor.callAsync(MeteorMethodIdentifier.TENANT_APPLICATION_UPDATE_LINKED_TASK, applicationId, linkedTaskId);
    } catch (error) {
      console.error('Failed to update tenant application linked task:', error);
      throw error;
    }
  }