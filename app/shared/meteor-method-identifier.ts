
export enum MeteorMethodIdentifier {
  TASK_INSERT = 'tasks.insert',
  TASK_GET_ALL = 'tasks.getAll',
  BLOB_UPLOAD_FILE = 'blobs.uploadFile',
  BLOB_UPLOAD_FILES = 'blobs.uploadFiles',
  PROPERTY_GET = 'properties.getOne',
  LISTING_GET_FOR_PROPERTY = 'listings.getForProperty',
  USER_REGISTER = 'user.register',
  // TODO: FIX THESE TWO !!
  USER_INSERT = 'users.insert',
  USER_GET = 'users.getOne',
  AGENT_INSERT = 'agents.insert',
  TENANT_INSERT = 'tenants.insert',
  LANDLORD_INSERT = 'landlords.insert',
}