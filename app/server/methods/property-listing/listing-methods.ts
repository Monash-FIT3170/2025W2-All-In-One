import {
  PropertyListingInspectionCollection,
  ListingCollection,
  ListingStatusCollection,
} from "../../database/property-listing/listing-collections";
import { ListingDocument } from "../../database/property-listing/models/ListingDocument";
import { PropertyListingInspectionDocument } from "../../database/property-listing/models/PropertyListingInspectionDocument";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { InvalidDataError } from "/app/server/errors/InvalidDataError";
import { ListingStatusDocument } from "/app/server/database/property-listing/models/ListingStatusDocument";
import { meteorWrappedInvalidDataError } from "/app/server/utils/error-utils";
import { ApiListing } from "/app/shared/api-models/property-listing/ApiListing";
import { ApiInsertListingPayload } from "/app/shared/api-models/property-listing/ListingInsertData";
import { ListingUpdateData } from "/app/shared/api-models/property-listing/ListingUpdateData";
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";
import { TaskPriority } from "/app/shared/task-priority-identifier";
import { PropertyCollection } from "../../database/property/property-collections";

const getListingForProperty = {
  [MeteorMethodIdentifier.LISTING_GET_FOR_PROPERTY]: async (
    propertyId: string
  ): Promise<ApiListing> => {
    const listing = await getListingDocumentAssociatedWithProperty(propertyId);
    if (!listing) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(
          `No listing found for property with Id ${propertyId}`
        )
      );
    }

    const listingDTO = await mapListingDocumentToListingDTO(listing).catch(
      (error) => {
        throw meteorWrappedInvalidDataError(error);
      }
    );

    return listingDTO;
  },
};

const submitDraftListing = {
  [MeteorMethodIdentifier.LISTING_SUBMIT_DRAFT]: async (
    propertyId: string
  ): Promise<{ success: boolean; propertyId: string }> => {
    try {
      // Find the listing for this property
      const listing =
        await getListingDocumentAssociatedWithProperty(propertyId);

      if (!listing) {
        throw meteorWrappedInvalidDataError(
          new InvalidDataError(
            `No listing found for property with Id ${propertyId}`
          )
        );
      }

      // Find the "Listed" listing status ID
      const listedStatus = await ListingStatusCollection.findOneAsync({
        name: ListingStatus.LISTED,
      });

      if (!listedStatus) {
        throw meteorWrappedInvalidDataError(
          new InvalidDataError("Property listing status not found in database")
        );
      }

      // Update the listing status
      const result = await ListingCollection.updateAsync(
        { property_id: propertyId },
        {
          $set: {
            listing_status_id: listedStatus._id,
          },
        }
      );

      if (result === 0) {
        throw meteorWrappedInvalidDataError(
          new InvalidDataError(
            `Failed to update listing for property ${propertyId}`
          )
        );
      }

      return { success: true, propertyId };
    } catch (error) {
      console.error("Error submitting draft listing:", error);
      throw error;
    }
  },
};

const getAllListedListings = {
  [MeteorMethodIdentifier.LISTING_GET_ALL_LISTED]: async (
    skip: number = 0,
    limit: number = 3
  ): Promise<ApiListing[]> => {
    const listedStatus = ListingStatus.LISTED;
    const listedStatusDocument =
      await getListingStatusDocumentByName(listedStatus);

    if (!listedStatusDocument) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(
          `Listing status '${listedStatus}' not found in the database.`
        )
      );
    }

    const listingDocuments = await ListingCollection.find(
      {
        listing_status_id: listedStatusDocument._id,
      },
      {
        skip: skip,
        limit: limit,
      }
    ).fetchAsync();

    if (listingDocuments.length === 0) {
      return [];
    }
    try {
      const apiListings = await Promise.all(
        listingDocuments.map((doc) => mapListingDocumentToListingDTO(doc))
      );
      return apiListings;
    } catch (error) {
      throw meteorWrappedInvalidDataError(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  },
};

async function mapListingDocumentToListingDTO(
  listing: ListingDocument
): Promise<ApiListing> {
  let propertyListingInspections: PropertyListingInspectionDocument[] = [];

  if (listing.inspection_ids.length > 0) {
    propertyListingInspections =
      await getPropertyListingInspectionDocumentsMatchingIds(
        listing.inspection_ids
      );
  }

  const listingStatusDocument = await getListingStatusDocumentById(
    listing.listing_status_id
  );

  if (!listingStatusDocument) {
    throw new InvalidDataError(
      `Invalid listing status entry for listing id ${listing._id}, property id ${listing.property_id}`
    );
  }

  return {
    property_id: listing.property_id,
    image_urls: listing.image_urls,
    listing_status: listingStatusDocument.name,
    lease_term: listing.lease_term,
    propertyListingInspections: propertyListingInspections.map(
      (inspection) => ({
        _id: inspection._id,
        start_time: inspection.starttime,
        end_time: inspection.endtime,
        tenant_ids: inspection.tenant_ids,
      })
    ),
  };
}

async function getListingDocumentAssociatedWithProperty(
  propertyId: string
): Promise<ListingDocument | undefined> {
  return await ListingCollection.findOneAsync({
    property_id: propertyId,
  });
}

async function getPropertyListingInspectionDocumentsMatchingIds(
  ids: string[]
): Promise<PropertyListingInspectionDocument[]> {
  return await PropertyListingInspectionCollection.find({
    _id: { $in: ids },
  }).fetchAsync();
}

async function getListingStatusDocumentById(
  id: string
): Promise<ListingStatusDocument | undefined> {
  return await ListingStatusCollection.findOneAsync(id);
}
const insertDraftListingDocumentForProperty = {
  [MeteorMethodIdentifier.INSERT_PROPERTY_LISTING]: async (
    data: ApiInsertListingPayload,
    status: ListingStatus
  ): Promise<string> => {
    const listingStatus = await getListingStatusDocumentByName(status);
    if (!listingStatus) {
      throw new Meteor.Error(
        `ListingStatus ${ListingStatus.DRAFT} does not exist`
      );
    }
    try {
      return ListingCollection.insertAsync({
        ...data,
        listing_status_id: listingStatus._id,
      });
    } catch (e) {
      throw new Error(`Failed to insert Property into ListingCollection: ${e}`);
    }
  },
};

async function getListingStatusDocumentByName(
  name: ListingStatus
): Promise<ListingStatusDocument | undefined> {
  return ListingStatusCollection.findOneAsync({ name: name });
}

const getListingStatusIdByName = {
  [MeteorMethodIdentifier.LISTING_STATUS_GET_BY_NAME]: async (
    name: ListingStatus
  ): Promise<string> => {
    const document = await getListingStatusDocumentByName(name);
    if (!document) {
      throw new Meteor.Error("not-found", `ListingStatus ${name} not found`);
    }
    return document._id;
  },
};

const insertPropertyListingInspection = {
  [MeteorMethodIdentifier.INSERT_PROPERTY_LISTING_INSPECTION]: async (
    propertyListingInspections: { start_time: Date; end_time: Date }[]
  ): Promise<string[]> => {
    const ids: string[] = [];
    for (const insp of propertyListingInspections) {
      if (!insp.start_time || !insp.end_time) {
        throw new Meteor.Error(
          "invalid-args",
          "start_time and end_time are required"
        );
      }
      const id = await PropertyListingInspectionCollection.insertAsync({
        starttime: new Date(insp.start_time),
        endtime: new Date(insp.end_time),
        tenant_ids: [""],
      } as PropertyListingInspectionDocument);
      ids.push(id);
    }
    return ids;
  },
};

const addTenantToInspectionMethod = {
  [MeteorMethodIdentifier.ADD_TENANT_TO_INSPECTION]: async (
    inspectionId: string,
    tenantId: string,
    propertyId: string
  ): Promise<PropertyListingInspectionDocument> => {
    console.log(
      "ADD_TENANT_TO_INSPECTION method called",
      inspectionId,
      tenantId
    );
    const inspection = await PropertyListingInspectionCollection.findOneAsync({
      _id: inspectionId,
    });
    if (!inspection)
      throw new Meteor.Error("not-found", "Inspection not found");
    console.log(
      "Tenant ID attempting to be added to the inspection 1" + tenantId
    );
    if (!inspection.tenant_ids.includes(tenantId)) {
      console.log(
        "Tenant ID attempting to be added to the inspection 2" + tenantId
      );
      await PropertyListingInspectionCollection.updateAsync(
        { _id: inspectionId },
        { $push: { tenant_ids: tenantId } }
      );
    }
    const property = await PropertyCollection.findOneAsync({
      _id: propertyId,
    });

    // Create task for tenant
    const taskData = {
      name: "Attend open inspection",
      description: "View the property at the scheduled time",
      dueDate: inspection.starttime,
      priority: TaskPriority.MEDIUM,
      propertyAddress: `${property?.streetname} ${property?.streetnumber}, ${property?.suburb}, ${property?.province} ${property?.postcode}`,
      propertyId: propertyId,
      userId: tenantId,
      };
    console.log("Creating task for tenant:", taskData);
    await Meteor.callAsync(MeteorMethodIdentifier.TASK_INSERT_FOR_TENANT, taskData);
    // return the updated doc so client thunk has fresh state
    const updated = await PropertyListingInspectionCollection.findOneAsync({
      _id: inspectionId,
    });
    if (!updated)
      throw new Meteor.Error(
        "update-failed",
        "Failed to fetch updated inspection"
      );

    return updated;
  },
};

const updatePropertyListingImages = {
  [MeteorMethodIdentifier.LISTING_UPDATE_IMAGES]: async (
    propertyId: string,
    imageUrls: string[]
  ): Promise<{ success: boolean; propertyId: string }> => {
    try {
      // Find the listing for this property
      const listing =
        await getListingDocumentAssociatedWithProperty(propertyId);

      if (!listing) {
        throw meteorWrappedInvalidDataError(
          new InvalidDataError(
            `No listing found for property with Id ${propertyId}`
          )
        );
      }

      // Update the listing images
      const result = await ListingCollection.updateAsync(
        { property_id: propertyId },
        {
          $set: {
            image_urls: imageUrls,
          },
        }
      );

      if (result === 0) {
        throw meteorWrappedInvalidDataError(
          new InvalidDataError(
            `Failed to update listing images for property ${propertyId}`
          )
        );
      }

      return { success: true, propertyId };
    } catch (error) {
      console.error("Error updating listing images:", error);
      throw error;
    }
  },
};

const updatePropertyListingData = {
  [MeteorMethodIdentifier.LISTING_UPDATE_DATA]: async (
    updateData: ListingUpdateData
  ): Promise<{ success: boolean; propertyId: string }> => {
    try {
      // Find the listing for this property
      const listing = await getListingDocumentAssociatedWithProperty(
        updateData.propertyId
      );

      if (!listing) {
        throw meteorWrappedInvalidDataError(
          new InvalidDataError(
            `No listing found for property with Id ${updateData.propertyId}`
          )
        );
      }

      // First, handle inspection times - insert new ones and get their IDs
      const inspectionIds: string[] = [];
      if (updateData.inspectionTimes && updateData.inspectionTimes.length > 0) {
        // Delete existing inspections for this listing
        await PropertyListingInspectionCollection.removeAsync({
          _id: { $in: listing.inspection_ids }
        });

        // Insert new inspections
        const inspectionDocuments = updateData.inspectionTimes.map(
          (inspection) => ({
            starttime: inspection.start_time,
            endtime: inspection.end_time,
          })
        );

        for (const inspectionDoc of inspectionDocuments) {
          const insertedId = await PropertyListingInspectionCollection.insertAsync(inspectionDoc);
          inspectionIds.push(insertedId);
        }
      }

      // Update the listing document
      const updateFields: Partial<ListingDocument> = {
        lease_term: updateData.leaseTerm,
        inspection_ids: inspectionIds,
      };

      await ListingCollection.updateAsync(
        { _id: listing._id },
        { $set: updateFields }
      );

      return { success: true, propertyId: updateData.propertyId };
    } catch (error) {
      console.error("Error updating property listing data:", error);
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(`Failed to update listing data: ${error}`)
      );
    }
  },
};

Meteor.methods({
  ...getListingForProperty,
  ...insertDraftListingDocumentForProperty,
  ...getListingStatusIdByName,
  ...submitDraftListing,
  ...getAllListedListings,
  ...updatePropertyListingImages,
  ...updatePropertyListingData,
  ...insertPropertyListingInspection,
  ...addTenantToInspectionMethod,
});
