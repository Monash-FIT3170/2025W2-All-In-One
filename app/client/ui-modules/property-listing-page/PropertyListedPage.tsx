import React from "react";
import { useLocation, useNavigate } from "react-router";
import { PropertyFeatures } from "./components/PropertyFeatures";
import { ListingPropertyDetails } from "./components/ListingPropertyDetails";
import {
  PropertyStatusPillVariant,
  ListingSummary,
} from "./components/ListingSummary";
import { ListingDescription } from "./components/ListingDescription";
import { LeftCircularArrowIcon } from "/app/client/ui-modules/theming/icons/LeftCircularArrowIcon";
import { RightCircularArrowIcon } from "/app/client/ui-modules/theming/icons/RightCircularArrowIcon";
import { ImageCarousel } from "../theming/components/ImageCarousel";
import {
  InspectionBookingListUiState,
  PropertyInspections,
} from "/app/client/ui-modules/property-listing-page/components/PropertyInspections";
import { ApplyButton } from "/app/client/ui-modules/property-listing-page/components/ApplyButton";
import { ContactAgentButton } from "/app/client/ui-modules/property-listing-page/components/ContactAgentButton";
import {
  ListingStatusPill,
  ListingStatusPillVariant,
} from "/app/client/ui-modules/property-listing-page/components/ListingStatusPill";
import { BackLink } from "../theming/components/BackLink";
import { BackButtonIcon } from "/app/client/ui-modules/theming/icons/BackButtonIcon";
import { twMerge } from "tailwind-merge";
import { SubmitDraftListingButton } from "/app/client/ui-modules/property-listing-page/components/SubmitDraftListingButton";
import { ReviewTenantButton } from "/app/client/ui-modules/property-listing-page/components/ReviewTenantButton";
import { ReviewTenantModal } from "/app/client/ui-modules/property-listing-page/components/ReviewTenantModal"; 

// Define interface for property data (matching what PropertyListingPage sends)
interface PropertyData {
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
}

// TODO: The state here is temporary. During server data integration, this should be moved to a redux slice.
export function PropertyListedPage({
  className = "",
}: {
  className?: string;
}): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for the review tenant modal
  const [showReviewModal, setShowReviewModal] = React.useState(false);

  // Extract property data from navigation state
  const propertyData: PropertyData | null = location.state?.propertyData || null;

  // If no property data, show error state and redirect
  if (!propertyData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            No Property Data Found
          </h1>
          <p className="text-gray-600 mb-6">
            This page requires property data from the draft submission process.
          </p>
          <button
            onClick={() => navigate('/property-listing')}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go to Property Listing
          </button>
        </div>
      </div>
    );
  }

  // Create property address string for the modal
  const propertyAddress = `${propertyData.streetNumber} ${propertyData.street}, ${propertyData.suburb}, ${propertyData.province} ${propertyData.postcode}`;

  // Handle different tenant application actions
  const handleRejectApplication = (applicationId: string) => {
    console.log(`Rejected application: ${applicationId}`);
  };

  const handleProgressApplication = (applicationId: string) => {
    console.log(`Progressed application: ${applicationId}`);
  };

  const handleBackgroundPass = (applicationId: string) => {
    console.log(`Background check passed for application: ${applicationId}`);
  };

  const handleBackgroundFail = (applicationId: string) => {
    console.log(`Background check failed for application: ${applicationId}`);
  };

  const handleSendToLandlord = (applicationId: string) => {
    console.log(`Sending application to landlord: ${applicationId}`);
  };

  return (
    <>
      <ListingPageContent
        // Use data from PropertyListingPage (via navigation state)
        streetNumber={propertyData.streetNumber}
        street={propertyData.street}
        suburb={propertyData.suburb}
        province={propertyData.province}
        postcode={propertyData.postcode}
        summaryDescription={propertyData.summaryDescription}
        propertyStatusText="Listed"
        propertyStatusPillVariant={PropertyStatusPillVariant.VACANT}
        propertyDescription={propertyData.propertyDescription}
        propertyFeatures={propertyData.propertyFeatures}
        propertyType={propertyData.propertyType}
        propertyLandArea={propertyData.propertyLandArea}
        propertyBathrooms={propertyData.propertyBathrooms}
        propertyParkingSpaces={propertyData.propertyParkingSpaces}
        propertyBedrooms={propertyData.propertyBedrooms}
        propertyPrice={propertyData.propertyPrice}
        inspectionBookingUiStateList={propertyData.inspectionBookingUiStateList}
        listingImageUrls={propertyData.listingImageUrls}
        listingStatusText="CURRENTLY LISTED"
        listingStatusPillVariant={ListingStatusPillVariant.CURRENT}
        shouldDisplayListingStatus={true}
        shouldDisplaySubmitDraftButton={false}
        shouldDisplayReviewTenantButton={true}
        onBack={() => {
          console.log("back button pressed");
          //TODO: Navigate back to the properties page
        }}
        onBook={(index: number) => {
          console.log(`booking button ${index} pressed`);
        }}
        onApply={() => {
          console.log("applied!");
        }}
        onContactAgent={() => console.log("contacting agent!")}
        onSubmitDraftListing={() => console.log("draft submitted!")}
        onReviewTenantApplications={() => {
          console.log("Opening review tenant applications modal");
          setShowReviewModal(true);
        }}
        className={twMerge("p-5", className)}
      />

      {/* Review Tenant Modal */}
      <ReviewTenantModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onReject={handleRejectApplication}
        onProgress={handleProgressApplication}
        onBackgroundPass={handleBackgroundPass}
        onBackgroundFail={handleBackgroundFail}
        onSendToLandlord={handleSendToLandlord}
        propertyAddress={propertyAddress}
      />
    </>
  );
}

function ListingPageContent({
  streetNumber,
  street,
  suburb,
  province,
  postcode,
  summaryDescription,
  propertyStatusText,
  propertyStatusPillVariant,
  propertyDescription,
  propertyFeatures,
  propertyType,
  propertyLandArea,
  propertyBathrooms,
  propertyParkingSpaces,
  propertyBedrooms,
  propertyPrice,
  inspectionBookingUiStateList,
  listingImageUrls,
  listingStatusText,
  listingStatusPillVariant,
  shouldDisplayListingStatus,
  shouldDisplaySubmitDraftButton,
  shouldDisplayReviewTenantButton,
  onBack,
  onBook,
  onApply,
  onContactAgent,
  onSubmitDraftListing,
  onReviewTenantApplications,
  className = "",
}: {
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
  shouldDisplayReviewTenantButton: boolean;
  onBack: () => void;
  onBook: (index: number) => void;
  onApply: () => void;
  onContactAgent: () => void;
  onSubmitDraftListing: () => void;
  onReviewTenantApplications: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={className}>
      <TopBar
        listingStatusText={listingStatusText}
        listingStatusPillVariant={listingStatusPillVariant}
        shouldDisplayListingStatus={shouldDisplayListingStatus}
        onBack={onBack}
        className="mb-3"
      />
      <ListingHero
        streetNumber={streetNumber}
        street={street}
        suburb={suburb}
        province={province}
        postcode={postcode}
        summaryDescription={summaryDescription}
        propertyStatusText={propertyStatusText}
        propertyStatusPillVariant={propertyStatusPillVariant}
        propertyType={propertyType}
        propertyLandArea={propertyLandArea}
        propertyBathrooms={propertyBathrooms}
        propertyParkingSpaces={propertyParkingSpaces}
        propertyBedrooms={propertyBedrooms}
        propertyPrice={propertyPrice}
        listingImageUrls={listingImageUrls}
        onApply={onApply}
        onContactAgent={onContactAgent}
        className="mb-6"
      />
      <ListingDetails
        propertyDescription={propertyDescription}
        inspectionBookingUiStateList={inspectionBookingUiStateList}
        onBook={onBook}
        propertyFeatures={propertyFeatures}
        className="mb-6"
      />
      <BottomBar
        shouldDisplaySubmitDraftButton={shouldDisplaySubmitDraftButton}
        shouldDisplayReviewTenantButton={shouldDisplayReviewTenantButton}
        onSubmitDraftListing={onSubmitDraftListing}
        onReviewTenantApplications={onReviewTenantApplications}
      />
    </div>
  );
}

function TopBar({
  listingStatusText,
  listingStatusPillVariant,
  shouldDisplayListingStatus,
  onBack,
  className = "",
}: {
  listingStatusText: string;
  listingStatusPillVariant: ListingStatusPillVariant;
  shouldDisplayListingStatus: boolean;
  onBack: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex items-start", className)}>
      <BackLink
        label="Back to Properties"
        backButtonIcon={<BackButtonIcon />}
        onClick={onBack}
        className="mr-auto"
      />
      {shouldDisplayListingStatus && (
        <ListingStatusPill
          text={listingStatusText}
          variant={listingStatusPillVariant}
        />
      )}
    </div>
  );
}

function ListingHero({
  className = "",
  streetNumber,
  street,
  suburb,
  province,
  postcode,
  summaryDescription,
  propertyStatusText,
  propertyStatusPillVariant,
  propertyType,
  propertyLandArea,
  propertyBathrooms,
  propertyParkingSpaces,
  propertyBedrooms,
  propertyPrice,
  listingImageUrls,
  onApply,
  onContactAgent,
}: {
  className?: string;
  streetNumber: string;
  street: string;
  suburb: string;
  province: string;
  postcode: string;
  summaryDescription: string;
  propertyStatusText: string;
  propertyStatusPillVariant: PropertyStatusPillVariant;
  propertyType: string;
  propertyLandArea: string;
  propertyBathrooms: string;
  propertyParkingSpaces: string;
  propertyBedrooms: string;
  propertyPrice: string;
  listingImageUrls: string[];
  onApply: () => void;
  onContactAgent: () => void;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex", className)}>
      <ImageCarousel
        imageUrls={listingImageUrls}
        leftArrowIcon={<LeftCircularArrowIcon />}
        rightArrowIcon={<RightCircularArrowIcon />}
        className="flex-3 min-w-[500px] mr-6"
      />
      <div className="flex-4 flex flex-col">
        <ListingSummary
          streetNumber={streetNumber}
          street={street}
          suburb={suburb}
          province={province}
          postcode={postcode}
          summaryDescription={summaryDescription}
          propertyStatusText={propertyStatusText}
          propertyStatusPillVariant={propertyStatusPillVariant}
          className="mb-2"
        />
        <ListingPropertyDetails
          propertyType={propertyType}
          area={propertyLandArea}
          bathrooms={propertyBathrooms}
          parking={propertyParkingSpaces}
          bedrooms={propertyBedrooms}
          price={propertyPrice}
          className="w-full mb-8"
        />
        <div className="flex">
          <ApplyButton onClick={onApply} className="mr-4" />
          <ContactAgentButton onClick={onContactAgent} />
        </div>
      </div>
    </div>
  );
}

function ListingDetails({
  propertyDescription,
  inspectionBookingUiStateList,
  onBook,
  propertyFeatures,
  className = "",
}: {
  propertyDescription: string;
  inspectionBookingUiStateList: InspectionBookingListUiState[];
  onBook: (index: number) => void;
  propertyFeatures: string[];
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex gap-6", className)}>
      <div className="flex-1 flex flex-col">
        <ListingDescription
          description={propertyDescription}
          className="mb-4"
        />
        <PropertyInspections
          bookingUiStateList={inspectionBookingUiStateList}
          onBook={onBook}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <PropertyFeatures featuresList={propertyFeatures} />
      </div>
    </div>
  );
}

function BottomBar({
  shouldDisplaySubmitDraftButton,
  shouldDisplayReviewTenantButton,
  onSubmitDraftListing,
  onReviewTenantApplications,
  className = "",
}: {
  shouldDisplaySubmitDraftButton: boolean;
  shouldDisplayReviewTenantButton: boolean;
  onSubmitDraftListing: () => void;
  onReviewTenantApplications: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex items-center justify-between", className)}>
      {shouldDisplayReviewTenantButton && (
        <ReviewTenantButton
          onClick={onReviewTenantApplications}
        />
      )}
      {shouldDisplaySubmitDraftButton && (
        <SubmitDraftListingButton
          onClick={onSubmitDraftListing}
          className="flex-1"
        />
      )}
    </div>
  );
}
