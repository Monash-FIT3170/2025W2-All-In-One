import React, { useEffect, useState } from "react";
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
import { ReviewTenantModal } from "../review-tenant-modal/ReviewTenantModal";
import { useAppDispatch } from "/app/client/store";
import { useSelector } from "react-redux";
import {
  load,
  selectPropertyListingUiState,
  submitDraftListingAsync,
} from "/app/client/ui-modules/property-listing-page/state/reducers/property-listing-slice";
import { PropertyListingPageUiState } from "/app/client/ui-modules/property-listing-page/state/PropertyListingUiState";
import { useSearchParams } from "react-router";
import EditDraftListingModal from "./components/EditDraftListingModal";
import { EditDraftListingButton } from "./components/EditDraftListingButton";
import {
  FormSchemaType,
} from "/app/client/ui-modules/property-form-agent/components/FormSchema";
import { DynamicMap } from "../common/map/DynamicMap";
import { SubHeading } from "../theming/components/SubHeading";
import { BasicMarker } from "../common/map/markers/BasicMarker";
import { PropertyMap, PropertyMapUiState } from "./components/PropertyMap";

export function PropertyListingPage({
  className = "",
}: {
  className?: string;
}): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const dispatch = useAppDispatch();
  const state: PropertyListingPageUiState = useSelector(
    selectPropertyListingUiState
  );

  useEffect(() => {
    if (!propertyId) {
      console.log("Property ID is not provided, loading default property");
      dispatch(load("1"));
      return;
    }
    console.log(`Loading property with ID: ${propertyId}`);
    dispatch(load(propertyId));
  }, []);

  if (state.shouldShowLoadingState) {
    return (
      <>
        <ListingPageContentLoadingSkeleton
          className={twMerge("p-5", className)}
        />
      </>
    );
  } else {
    return (
      <>
        <ListingPageContent
          streetNumber={state.streetNumber}
          street={state.street}
          suburb={state.suburb}
          province={state.province}
          postcode={state.postcode}
          summaryDescription={state.summaryDescription}
          propertyStatusText={state.propertyStatusText}
          propertyStatusPillVariant={state.propertyStatusPillVariant}
          propertyDescription={state.propertyDescription}
          propertyFeatures={state.propertyFeatures}
          propertyType={state.propertyType}
          propertyLandArea={state.propertyLandArea}
          propertyBathrooms={state.propertyBathrooms}
          propertyParkingSpaces={state.propertyParkingSpaces}
          propertyBedrooms={state.propertyBedrooms}
          propertyPrice={state.propertyPrice}
          mapUiState={state.mapUiState}
          inspectionBookingUiStateList={state.inspectionBookingUiStateList}
          listingImageUrls={state.listingImageUrls}
          listingStatusText={state.listingStatusText}
          listingStatusPillVariant={state.listingStatusPillVariant}
          shouldDisplayListingStatus={state.shouldDisplayListingStatus}
          shouldDisplaySubmitDraftButton={state.shouldDisplaySubmitDraftButton}
          shouldDisplayReviewTenantButton={
            state.shouldDisplayReviewTenantButton
          }
          shouldDisplayEditListingButton={state.shouldDisplayEditListingButton}
          propertyLandlordId={state.propertyLandlordId}
          propertyId={state.propertyId}
          onBack={() => {
            console.log("back button pressed");
          }}
          onBook={(index: number) => {
            console.log(`booking button ${index} pressed`);
          }}
          onApply={() => {
            console.log("applied!");
          }}
          onContactAgent={() => console.log("contacting agent!")}
          onSubmitDraftListing={() => {
            console.log("draft submitted!");
            // Change value of "1" later to property ID
            dispatch(submitDraftListingAsync(state.propertyId));
          }}
          className={twMerge("p-5", className)}
        />
      </>
    );
  }
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
  mapUiState,
  inspectionBookingUiStateList,
  listingImageUrls,
  listingStatusText,
  listingStatusPillVariant,
  shouldDisplayListingStatus,
  shouldDisplaySubmitDraftButton,
  shouldDisplayReviewTenantButton,
  shouldDisplayEditListingButton,
  propertyLandlordId,
  propertyId,
  onBack,
  onBook,
  onApply,
  onContactAgent,
  onSubmitDraftListing,
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
  mapUiState: PropertyMapUiState;
  inspectionBookingUiStateList: InspectionBookingListUiState[];
  listingImageUrls: string[];
  listingStatusText: string;
  listingStatusPillVariant: ListingStatusPillVariant;
  shouldDisplayListingStatus: boolean;
  shouldDisplaySubmitDraftButton: boolean;
  shouldDisplayReviewTenantButton: boolean;
  shouldDisplayEditListingButton: boolean;
  propertyLandlordId: string;
  propertyId: string;
  onBack: () => void;
  onBook: (index: number) => void;
  onApply: () => void;
  onContactAgent: () => void;
  onSubmitDraftListing: () => void;
  className?: string;
}): React.JSX.Element {
  const [isReviewTenantModalOpen, setIsReviewTenantModalOpen] = useState(false);

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
        mapUiState={mapUiState}
        inspectionBookingUiStateList={inspectionBookingUiStateList}
        onBook={onBook}
        propertyFeatures={propertyFeatures}
        className="mb-6"
      />
      <BottomBar
        shouldDisplaySubmitDraftButton={shouldDisplaySubmitDraftButton}
        shouldDisplayReviewTenantButton={shouldDisplayReviewTenantButton}
        shouldDisplayEditListingButton={shouldDisplayEditListingButton}
        onSubmitDraftListing={onSubmitDraftListing}
        onReviewTenant={() => setIsReviewTenantModalOpen(true)}
      />

      <ReviewTenantModal
        isOpen={isReviewTenantModalOpen}
        onClose={() => setIsReviewTenantModalOpen(false)}
        onReject={(applicationId: string) => {
          console.log(`Rejected application ${applicationId}`);
        }}
        onAccept={(applicationId: string) => {
          console.log(`Progressed application ${applicationId}`);
        }}
        // onBackgroundPass={(applicationId: string) => {
        //   console.log(
        //     `Background check passed for application ${applicationId}`
        //   );
        // }}
        // onBackgroundFail={(applicationId: string) => {
        //   console.log(
        //     `Background check failed for application ${applicationId}`
        //   );
        // }}
        onSendToLandlord={(applicationId: string) => {
          console.log(`Sent application ${applicationId} to landlord`);
        }}
        propertyAddress={`${streetNumber} ${street}, ${suburb}, ${province} ${postcode}`}
        propertyLandlordId={propertyLandlordId}
        propertyId={propertyId}
      />
    </div>
  );
}

function ListingPageContentLoadingSkeleton({
  className = "",
}: {
  className?: string;
}): React.JSX.Element {
  return <p className={className}>Loading...</p>;
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
  mapUiState,
  inspectionBookingUiStateList,
  onBook,
  propertyFeatures,
  className = "",
}: {
  propertyDescription: string;
  mapUiState: PropertyMapUiState;
  inspectionBookingUiStateList: InspectionBookingListUiState[];
  onBook: (index: number) => void;
  propertyFeatures: string[];
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex gap-7", className)}>
      <div className="flex-1 flex flex-col">
        <ListingDescription
          description={propertyDescription}
          className="mb-4"
        />
        <PropertyInspections
          bookingUiStateList={inspectionBookingUiStateList}
          onBook={onBook}
          className="w-full"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <PropertyFeatures featuresList={propertyFeatures} className="mb-4" />
        <SubHeading text="Location" className="mb-2" />
        <PropertyMap mapUiState={mapUiState} />
      </div>
    </div>
  );
}

function BottomBar({
  shouldDisplaySubmitDraftButton,
  shouldDisplayReviewTenantButton,
  shouldDisplayEditListingButton,
  onSubmitDraftListing,
  onReviewTenant,
  className = "",
}: {
  shouldDisplaySubmitDraftButton: boolean;
  shouldDisplayReviewTenantButton: boolean;
  shouldDisplayEditListingButton: boolean;
  onSubmitDraftListing: () => void;
  onReviewTenant: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <div
      className={twMerge(
        "flex justify-between items-center gap-2",
        className
      )}
    >
      {/* Left side - Review Tenant Button */}
      <div className="flex">
        {shouldDisplayReviewTenantButton && (
          <ReviewTenantButton onClick={onReviewTenant} />
        )}
      </div>

      <div className="flex">
        {shouldDisplayEditListingButton && <ListingModalEditor />}
        {shouldDisplaySubmitDraftButton && (
          <SubmitDraftListingButton onClick={onSubmitDraftListing} />
        )}
      </div>
    </div>
  );
}

function ListingModalEditor({
  className = "",
}: {
  className?: string;
}): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const state: PropertyListingPageUiState = useSelector(
    selectPropertyListingUiState
  );

  const listingInfo: FormSchemaType = {
    landlord: state.propertyLandlordId,
    property_type: state.propertyType.toLowerCase(), // Ensure property type matches dropdown options (house or apartment)
    address: `${state.streetNumber} ${state.street}`,
    city: state.suburb,
    state: state.province,
    postal_code: state.postcode,
    apartment_number: "",
    bedroom_number: Number(state.propertyBedrooms),
    bathroom_number: Number(state.propertyBathrooms),
    space: Number(state.areaValue),
    description: state.propertyDescription,
    images: [],
    available_dates: new Date(),
    lease_term: "12_months",
    show_contact_boolean: true,
    suburb: state.suburb,
    address_number: state.streetNumber,
    monthly_rent: Number(state.propertyPrice),
    property_feature_ids: []
  };

  return (
    <>
      <EditDraftListingButton onClick={toggleModal} />
      <EditDraftListingModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        propertyForm={listingInfo}
        landlords={state.landlords}
        propertyId={state.propertyId}
      />
    </>
  );
}
