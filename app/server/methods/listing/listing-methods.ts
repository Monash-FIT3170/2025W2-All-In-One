import { Meteor } from "meteor/meteor";
import { ListingCollection } from "/app/server/database/listing/ListingCollection";
import { ListingDocument } from "/app/server/database/listing/ListingDocument";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ListingDTO } from "./ListingDTO";

const listingInsertMethod = {
  [MeteorMethodIdentifier.LISTING_INSERT]: async (doc: ListingDocument): Promise<string> => {
    return await ListingCollection.insertAsync({
      ...doc,
    });
  }
};

const listingGetAllMethod = {
  [MeteorMethodIdentifier.LISTING_GET_ALL]: async (): Promise<ListingDTO[]> => {
    console.log("Server method listing.getAll called");
    const fetchedListingDocuments = await ListingCollection.find({}).fetchAsync();
    const mappedListings = fetchedListingDocuments.map(mapListingDocumentToListingDTO);
    console.log("Mapped listings:", mappedListings);
    return mappedListings;
  }
};

function mapListingDocumentToListingDTO(listing: ListingDocument): ListingDTO {
  return {
    listingId: listing._id,
    title: listing.title,
    description: listing.description
  };
}

const listingGetOneMethod = {
  [MeteorMethodIdentifier.LISTING_GET_ONE]: async (listingId: string): Promise<ListingDocument | null> => {
    const listing = await ListingCollection.findOne({ _id: listingId });
    return listing || null;
  }
};

Meteor.methods({
  ...listingInsertMethod,
  ...listingGetAllMethod,
  ...listingGetOneMethod,
});
console.log("Server methods registered.");