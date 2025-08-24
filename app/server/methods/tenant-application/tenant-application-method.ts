import { Meteor } from 'meteor/meteor';
import { TenantApplicationCollection } from '../../database/tenant/collections/TenantApplicationCollection';
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';
import { TenantApplicationDocument } from '../../database/tenant/models/TenantApplicationDocument';
import { ApiTenantApplication } from '/app/shared/api-models/tenant/ApiTenantApplication';
import { TenantApplicationStatus } from '/app/shared/api-models/tenant/TenantApplicationStatus';
import { InvalidDataError } from '/app/server/errors/InvalidDataError';
import { meteorWrappedInvalidDataError } from '/app/server/utils/error-utils';


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
    taskId: doc.taskId,
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
      const updateData: any = {
        status,
        step,
        updatedAt: new Date(),
      };

      if (taskId) {
        updateData.taskId = taskId;
      }

      await TenantApplicationCollection.updateAsync(
        { _id: { $in: applicationIds } },
        { $set: updateData }
      );
    } catch (error) {
      console.error("Error in tenantApplicationUpdateStatusMethod:", error);
      throw meteorWrappedInvalidDataError(error as InvalidDataError);
    }
  },
};

Meteor.methods({
  ...tenantApplicationGetByPropertyIdMethod,
  ...tenantApplicationGetByLandlordIdMethod,
  ...tenantApplicationInsertMethod,
  ...tenantApplicationUpdateStatusMethod,
});