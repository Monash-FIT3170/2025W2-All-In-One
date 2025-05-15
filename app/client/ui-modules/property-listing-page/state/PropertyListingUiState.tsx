import { ListingStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingStatusPill";
import { PropertyStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingSummary";
import { InspectionBookingListUiState } from "/app/client/ui-modules/property-listing-page/components/PropertyInspections";

export type PropertyListingPageUiState = {
  streetNumber: string;
  street: string;
  suburb: string;
  province: string;
  postcode: string;
  summaryDescription: string;
  propertyStatusText: string;
  propertyStatusPillVariant: PropertyStatusPillVariant;
  propertyDescription: string;
  propertyFeatures: string[];
  propertyType: string;
  propertyLandArea: string;
  propertyBathrooms: string;
  propertyParkingSpaces: string;
  propertyBedrooms: string;
  propertyPrice: string;
  inspectionBookingUiStateList: InspectionBookingListUiState[];
  listingImageUrls: string[];
  listingStatusText: string;
  listingStatusPillVariant: ListingStatusPillVariant;
  shouldDisplayListingStatus: boolean;
  shouldDisplaySubmitDraftButton: boolean;
  shouldShowLoadingState: boolean;
};
