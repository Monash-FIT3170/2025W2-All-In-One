import {
  InspectionCollection,
  ListingCollection,
  ListingStatusCollection,
} from "../../database/property-listing/listing-collections";
import { ListingDocument } from "../../database/property-listing/models/ListingDocument";
import { ListingDTO } from "./models/ListingDTO";
import { InspectionDocument } from "../../database/property-listing/models/InspectionDocument";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { InvalidDataError } from "/app/server/errors/InvalidDataError";
import { ListingStatusDocument } from "/app/server/database/property-listing/models/ListingStatusDocument";
import { meteorWrappedInvalidDataError } from "/app/server/utils/error-utils";

const getListingForProperty = {
  [MeteorMethodIdentifier.LISTING_GET_FOR_PROPERTY]: async (
    propertyId: string
  ): Promise<ListingDTO> => {
    const listing = await getListingDocumentAssociatedWithProperty(propertyId);

    if (!listing) {
      throw meteorWrappedInvalidDataError(
        new InvalidDataError(
          `No listing found for property with Id ${propertyId}`
        )
      );
    }

    const listingDTO = await mapListingToListingDTO(listing).catch((error) => {
      throw new Meteor.Error(error.name, error.message);
    });

    return listingDTO;
  },
};

async function mapListingToListingDTO(
  listing: ListingDocument
): Promise<ListingDTO> {
  let inspections: InspectionDocument[] = [];

  if (listing.inspection_ids.length > 0) {
    inspections = await getInspectionDocumentsMatchingIds(
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
    inspections: inspections.map((inspection) => ({
      start_time: inspection.starttime,
      end_time: inspection.endtime,
    })),
  };
}

async function getListingDocumentAssociatedWithProperty(
  propertyId: string
): Promise<ListingDocument | undefined> {
  return await ListingCollection.findOneAsync({
    property_id: propertyId,
  });
}

async function getInspectionDocumentsMatchingIds(
  ids: string[]
): Promise<InspectionDocument[]> {
  return await InspectionCollection.find({
    _id: { $in: ids },
  }).fetchAsync();
}

async function getListingStatusDocumentById(
  id: string
): Promise<ListingStatusDocument | undefined> {
  return await ListingStatusCollection.findOneAsync(id);
}

Meteor.methods({
  ...getListingForProperty,
});
