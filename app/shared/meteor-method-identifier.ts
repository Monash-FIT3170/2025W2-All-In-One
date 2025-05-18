
export enum MeteorMethodIdentifier {
  TASK_INSERT = 'tasks.insert',
  TASK_GET_ALL = 'tasks.getAll',
  TASK_GET = 'tasks.getOne',
  BLOB_UPLOAD_FILE = 'blobs.uploadFile',
  BLOB_UPLOAD_FILES = 'blobs.uploadFiles',
  PROPERTY_GET = 'properties.getOne',
  LISTING_GET_FOR_PROPERTY = 'listings.getForProperty',
  USER_REGISTER = 'user.register',
  USER_ACCOUNT_INSERT = 'users.insert',
  USER_ACCOUNT_GET = 'users.getOne',
  AGENT_INSERT = 'agents.insert',
  AGENT_GET = 'agents.getOne',
  TENANT_INSERT = 'tenants.insert',
  TENANT_GET = 'tenants.getOne',
  LANDLORD_INSERT = 'landlords.insert',
  LANDLORD_GET = 'landlords.getOne',
}