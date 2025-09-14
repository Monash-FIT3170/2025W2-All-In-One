import { Meteor } from 'meteor/meteor';
import { TenantApplicationCollection } from '../../database/tenant/collections/TenantApplicationCollection';
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';
import { TenantApplicationDocument } from '../../database/tenant/models/TenantApplicationDocument';
import { ApiTenantApplication } from '../../../shared/api-models/tenant-application/ApiTenantApplication';
import { TenantApplicationStatus } from '../../../shared/api-models/tenant-application/TenantApplicationStatus';
import { InvalidDataError } from '/app/server/errors/InvalidDataError';
import { meteorWrappedInvalidDataError } from '/app/server/utils/error-utils';

type TenantApplicationUpdateData = {
  status: string;
  step: number;
  updatedAt: Date;
  taskId?: string;
};

async function mapTenantApplicationDocumentToDTO(
  doc: TenantApplicationDocument
): Promise<ApiTenantApplication> {
  // Validate and convert status string to enum
  if (!Object.values(TenantApplicationStatus).includes(doc.status as TenantApplicationStatus)) {
    throw new InvalidDataError(
      `Invalid tenant application status '${doc.status}' for application id ${doc._id}`
    );
  }

  return {
    id: doc._id,
    propertyId: doc.propertyId,
    applicantName: doc.applicantName,
    status: doc.status as TenantApplicationStatus,
    step: doc.step,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    agentId: doc.agentId,
    landlordId: doc.landlordId,
    tenantUserId: doc.tenantUserId,
    taskId: doc.taskId,
    linkedTaskId: doc.linkedTaskId,
  };
}

// GET TENANT APPLICATIONS BY PROPERTY ID
const tenantApplicationGetByPropertyIdMethod = {
  [MeteorMethodIdentifier.TENANT_APPLICATION_GET_BY_PROPERTY_ID]: async (
    propertyId: string
  ): Promise<ApiTenantApplication[]> => {
    try {

      const applications = await TenantApplicationCollection.find({ propertyId }).fetchAsync();

      const applicationDTOs = await Promise.all(
        applications.map((application) =>
          mapTenantApplicationDocumentToDTO(application)
        )
      );
      return applicationDTOs;
    } catch (error) {
      console.error("Error in tenantApplicationGetByPropertyIdMethod:", error);
      throw meteorWrappedInvalidDataError(error as InvalidDataError);
    }
  },
};

// GET TENANT APPLICATIONS BY LANDLORD ID
const tenantApplicationGetByLandlordIdMethod = {
  [MeteorMethodIdentifier.TENANT_APPLICATION_GET_BY_LANDLORD_ID]: async (
    landlordId: string
  ): Promise<ApiTenantApplication[]> => {
    try {

      const applications = await TenantApplicationCollection.find({ landlordId }).fetchAsync();

      const applicationDTOs = await Promise.all(
        applications.map((application) =>
          mapTenantApplicationDocumentToDTO(application)
        )
      );
      return applicationDTOs;
    } catch (error) {
      console.error("Error in tenantApplicationGetByLandlordIdMethod:", error);
      throw meteorWrappedInvalidDataError(error as InvalidDataError);
    }
  },
};

// INSERT TENANT APPLICATION
const tenantApplicationInsertMethod = {
  [MeteorMethodIdentifier.TENANT_APPLICATION_INSERT]: async (
    applicationData: {
      propertyId: string;
      applicantName: string;
      agentId: string;
      landlordId: string;
      tenantUserId: string;
    }
  ): Promise<string> => {
    try {
      const now = new Date();

      const applicationDoc: Omit<TenantApplicationDocument, '_id'> = {
        propertyId: applicationData.propertyId,
        applicantName: applicationData.applicantName,
        status: 'undetermined',
        step: 1,
        createdAt: now,
        updatedAt: now,
        agentId: applicationData.agentId,
        landlordId: applicationData.landlordId,
        tenantUserId: applicationData.tenantUserId,
      };

      const insertedId = await TenantApplicationCollection.insertAsync(applicationDoc);

      return insertedId;
    } catch (error) {
      console.error("Error in tenantApplicationInsertMethod:", error);
      throw meteorWrappedInvalidDataError(error as InvalidDataError);
    }
  },
};

// UPDATE TENANT APPLICATIONS STATUS
const tenantApplicationUpdateStatusMethod = {
  [MeteorMethodIdentifier.TENANT_APPLICATION_UPDATE_STATUS]: async (
    applicationIds: string[],
    status: string,
    step: number,
    taskId?: string
  ): Promise<void> => {
    try {
      // // Check what applications exist before update
      // const existingApps = await TenantApplicationCollection.find({ _id: { $in: applicationIds } }).fetchAsync();
      // console.log('Existing applications before update:', existingApps.map(app => ({
      //   id: app._id,
      //   name: app.applicantName,
      //   status: app.status
      // })));


      const updateData: TenantApplicationUpdateData = {
        status,
        step,
        updatedAt: new Date(),
      };

      if (taskId) {
        updateData.taskId = taskId;
      }

      await TenantApplicationCollection.updateAsync(
        { _id: { $in: applicationIds } },
        { $set: updateData },
        { multi: true } // update multiple documents
      );
      // // Check what applications exist after update
      // const updatedApps = await TenantApplicationCollection.find({ _id: { $in: applicationIds } }).fetchAsync();
      // console.log('Applications after update:', updatedApps.map(app => ({
      //   id: app._id,
      //   name: app.applicantName,
      //   status: app.status
      // })));

    } catch (error) {
      console.error("Error in tenantApplicationUpdateStatusMethod:", error);
      throw meteorWrappedInvalidDataError(error as InvalidDataError);
    }
  },
};

const tenantApplicationUpdateLinkedTaskMethod = {
  [MeteorMethodIdentifier.TENANT_APPLICATION_UPDATE_LINKED_TASK]: async (
    applicationId: string,
    linkedTaskId: string
  ): Promise<void> => {
    try {
      // Validate inputs
      if (!applicationId || !linkedTaskId) {
        throw new InvalidDataError('Application ID and Linked Task ID are required');
      }

      // Update the tenant application with the linked task ID
      const result = await TenantApplicationCollection.updateAsync(
        { _id: applicationId },
        {
          $set: {
            linkedTaskId: linkedTaskId,
            updatedAt: new Date()
          }
        }
      );

      if (result === 0) {
        throw new InvalidDataError('Tenant application not found');
      }

      console.log(`Updated tenant application ${applicationId} with linked task ID ${linkedTaskId}`);
    } catch (error) {
      console.error("Error in tenantApplicationUpdateLinkedTaskMethod:", error);
      throw meteorWrappedInvalidDataError(error as InvalidDataError);
    }
  },
};
Meteor.methods({
  ...tenantApplicationGetByPropertyIdMethod,
  ...tenantApplicationGetByLandlordIdMethod,
  ...tenantApplicationInsertMethod,
  ...tenantApplicationUpdateStatusMethod,
  ...tenantApplicationUpdateLinkedTaskMethod,
});