import {
  PropertyCollection
} from "../database/property/property-collections";
import {
  ListingCollection
} from "../database/property-listing/listing-collections";

/**
 * Automatically closes expired listings and their related properties.
 */
export async function closeExpiredListings(): Promise<void> {
  try {
    const now = new Date();

    const expiredListings = await ListingCollection.find({
      endlease_date: { $lt: now },
      listing_status_id: { $ne: "3" } // "3" = closed
    }).fetchAsync();

    if (expiredListings.length === 0) {
      console.log("[AutoClose] No expired listings found.");
      return;
    }

    for (const listing of expiredListings) {
      await ListingCollection.updateAsync(
        { _id: listing._id },
        { $set: { listing_status_id: "1" } }
      );
      console.log(`[AutoClose] Listing ${listing._id} marked as closed.`);

      if (listing.property_id) {
        const propertyResult = await PropertyCollection.updateAsync(
          { _id: listing.property_id },
          { $set: { property_status_id: "1" } } // "1" = VACANT
        );

        if (propertyResult) {
          console.log(`[AutoClose] Property ${listing.property_id} marked as VACANT.`);
        } else {
          console.warn(`[AutoClose] Property ${listing.property_id} not found for listing ${listing._id}.`);
        }
      }
    }
  } catch (err) {
    console.error("[AutoClose] Failed to make expired listings draft:", err);
  }
}
