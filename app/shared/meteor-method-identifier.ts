export enum MeteorMethodIdentifier {
  TASK_INSERT_FOR_AGENT = "tasks.insertForAgent",
  TASK_INSERT_FOR_LANDLORD = "tasks.insertForLandlord",
  TASK_GET_ALL = "tasks.getAll",
  TASK_GET = "tasks.getOne",
  TASK_GET_MULTIPLE = "tasks.getMultiple",
  BLOB_UPLOAD_FILE = "blobs.uploadFile", // Uploads a single file to Azure Blob Storage
  BLOB_UPLOAD_FILES = "blobs.uploadFiles", // Uploads multiple files to Azure Blob Storage
  PROPERTY_GET = "properties.getOne",
  PROPERTY_GET_ALL = "properties.getAll",
  PROPERTY_GET_COUNT = "properties.getCount",
  PROPERTY_GET_ALL_BY_AGENT_ID = "properties.getAllByAgentId", // Fetches all properties managed by an agent by their userID
  PROPERTY_INSERT = "properties.insert", // Inserts property into property collection
  PROPERTY_PRICE_INSERT = "properties.insertPrice", // Inserts property price into property price collection
  GET_LANDLORD_DASHBOARD = "properties.getLandlordDashboard", // Fetch all data analytics required for landlord dashboard
  PROPERTY_LANDLORD_GET_COUNT = "properties.getCountLandlord",
  PROPERTY_LANDLORD_GET_STATUS_COUNTS = "properties.getStatusCountsLandlord",
  LISTING_GET_FOR_PROPERTY = "listings.getForProperty", //Get listing document from property id
  LISTING_STATUS_GET_BY_NAME = "listings.getStatusByName", // Get listing status document by name
  LISTING_GET_ALL_LISTED = "listings.getAllListed",
  INSERT_PROPERTY_LISTING = "listings.insertProperty",
  USER_REGISTER = "user.register",
  USER_ACCOUNT_INSERT = "users.insert",
  USER_ACCOUNT_GET = "users.getOne",
  AGENT_INSERT = "agents.insert",
  AGENT_GET = "agents.getOne",
  AGENT_UPDATE_TASKS = "agents.updateTasks", // Adds the id of the newly created task to the agent's task_ids
  TENANT_INSERT = "tenants.insert",
  TENANT_GET = "tenants.getOne",
  LANDLORD_INSERT = "landlords.insert",
  LANDLORD_GET = "landlords.getOne",
  LANDLORD_GET_BY_LANDLORD_ID = "landlords.getByLandlordId", // Get landlord by landlord ID (not user ID)
  LANDLORD_UPDATE_TASKS = "landlords.updateTasks", // Adds the id of the newly created task to the landlord's task_ids
  LANDLORD_GET_ALL = "landlords.getAll", // Get All Landlords
  PROPERTY_STATUS_GET = "propertyStatus.getOne", // Find ID of property status by name
  PROPERTY_GET_BY_TENANT_ID = "property.getByTenantId",
  PROPERTY_GET_BY_AGENT_ID = "property.getByAgentId", // fetches all properties managed by an agent by their ID
  PROPERTY_GET_ALL_BY_LANDLORD_ID = "property.getAllByLandlordId", // fetches all properties managed by a landlord by their ID
  PROPERTY_DATA_UPDATE = "property.updateData",
  PROFILE_GET = "profileData.getOne",
  PROFILE_EDIT = "profileData.edit",
  PROFILE_INSERT = "profileData.insert",
  LISTING_SUBMIT_DRAFT = "listing.submitDraft",
  PROPERTY_FEATURES_GET_ALL = "propertyFeatures.getAll",


  // Tenant application methods
  TENANT_APPLICATION_GET_BY_PROPERTY_ID = "tenantApplication.getByPropertyId",
  TENANT_APPLICATION_GET_BY_LANDLORD_ID = "tenantApplications.getByLandlordId",
  TENANT_APPLICATION_INSERT = "tenantApplications.insert",
  TENANT_APPLICATION_UPDATE_STATUS = "tenantApplications.updateStatus",

  // Inspection booking methods
  INSPECTION_BOOKING_INSERT = "inspectionBookings.insert",
  INSPECTION_BOOKING_GET_BY_PROPERTY_AND_TENANT = "inspectionBookings.getByPropertyAndTenant",
  INSPECTION_BOOKING_DELETE = "inspectionBookings.delete",
  PROPERTY_SEARCH = "PROPERTY_SEARCH",
}
