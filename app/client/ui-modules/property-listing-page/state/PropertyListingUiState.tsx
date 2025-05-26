import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { ListingStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingStatusPill";
import { PropertyStatusPillVariant } from "/app/client/ui-modules/property-listing-page/components/ListingSummary";
import { InspectionBookingListUiState } from "/app/client/ui-modules/property-listing-page/components/PropertyInspections";

export type PropertyListingPageUiState = {
  propertyId: string;
  propertyLandlordId: string;
  streetNumber: string;
  street: string;
  suburb: string;
  province: string;
  postcode: string;
  summaryDescription: string;
  areaValue: number
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
  landlords: Landlord[];
  currentPropertyId?: string;
};