import {
  InspectionCollection,
  ListingCollection,
} from "../../database/property-listing/listing-collections";
import { ListingDocument } from "../../database/property-listing/models/ListingDocument";
import { ListingDTO } from "./models/ListingDTO";
import { InspectionDocument } from "../../database/property-listing/models/InspectionDocument";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

const getListingForProperty = {
  [MeteorMethodIdentifier.LISTING_GET_FOR_PROPERTY]: async (
    propertyId: string
  ): Promise<ListingDTO> => {
    const listing = await ListingCollection.findOne({
      property_id: propertyId,
    });

    if (!listing) {
      throw new Meteor.Error(
        "notFound",
        `No listing found for property ID: ${propertyId}`
      );
    }

    const listingDTO = await mapListingToListingDTO(listing);

    return listingDTO;
  },
};

async function mapListingToListingDTO(listing: ListingDocument): Promise<ListingDTO> {
  let inspections: InspectionDocument[] = [];

  if (listing.inspection_ids.length > 0) {
    inspections = await InspectionCollection.find({
      _id: { $in: listing.inspection_ids },
    }).fetchAsync();
  }

  return {
    property_id: listing.property_id,
    image_urls: listing.image_urls,
    inspections: inspections.map((inspection) => ({
      start_time: inspection.starttime,
      end_time: inspection.endtime,
    })),
  };
}

Meteor.methods({
  ...getListingForProperty
})