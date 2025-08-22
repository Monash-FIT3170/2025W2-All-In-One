import { Meteor } from 'meteor/meteor';
import { TenantApplicationCollection } from '../../database/tenant/collections/TenantApplicationCollection';
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';
import { TenantApplicationDocument } from '../../database/tenant/models/TenantApplicationDocument';
import { ApiTenantApplication } from '/app/shared/api-models/tenant/ApiTenantApplication';

// Helper function to map document to API model
function mapTenantApplicationDocumentToDTO(doc: TenantApplicationDocument): ApiTenantApplication {
  return {
    id: doc._id,
    propertyId: doc.propertyId,
    applicantName: doc.applicantName,
    status: doc.status,
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
    const applications = await TenantApplicationCollection.find({ propertyId }).fetchAsync();
    return applications.map(mapTenantApplicationDocumentToDTO);
  },
};

// GET TENANT APPLICATIONS BY LANDLORD ID
const tenantApplicationGetByLandlordIdMethod = {
  [MeteorMethodIdentifier.TENANT_APPLICATION_GET_BY_LANDLORD_ID]: async (
    landlordId: string
  ): Promise<ApiTenantApplication[]> => {
    const applications = await TenantApplicationCollection.find({ landlordId }).fetchAsync();
    return applications.map(mapTenantApplicationDocumentToDTO);
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
  },
};

Meteor.methods({
  ...tenantApplicationGetByPropertyIdMethod,
  ...tenantApplicationGetByLandlordIdMethod,
  ...tenantApplicationInsertMethod,
  ...tenantApplicationUpdateStatusMethod,
});