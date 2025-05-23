import { ListingStatus } from "../../../../shared/api-models/property-listing/ListingStatus";

export type ListingStatusDocument = {
  _id: string;
  name: ListingStatus;
};