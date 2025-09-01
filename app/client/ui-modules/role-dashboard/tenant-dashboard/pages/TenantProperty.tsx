import React, { useEffect, useState } from "react";
import { PropertyFeatures } from "../../../common/property-components/PropertyFeatures";
import { PropertySpecifics } from "../../../common/property-components/PropertySpecifics";
import {
  PropertyStatusPillVariant,
  PropertySummary,
} from "../components/PropertySummary";
import { PropertyDescription } from "../../../common/property-components/PropertyDescription";
import { LeftCircularArrowIcon } from "/app/client/ui-modules/theming/icons/LeftCircularArrowIcon";
import { RightCircularArrowIcon } from "/app/client/ui-modules/theming/icons/RightCircularArrowIcon";
import { ImageCarousel } from "../../../theming/components/ImageCarousel";
import {
  InspectionBookingListUiState,
  PropertyInspections,
} from "../../../common/property-components/PropertyInspections";
import { BackLink } from "../../../theming/components/BackLink";
import { BackButtonIcon } from "/app/client/ui-modules/theming/icons/BackButtonIcon";
import { twMerge } from "tailwind-merge";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import { useSelector } from "react-redux";
import {
  load, 
  selectTenantPropertyUiState,
  submitDraftListingAsync,
} from "/app/client/ui-modules/role-dashboard/tenant-dashboard/state/reducers/tenant-property-slice";
import { TenantPropertyUiState } from "../state/TenantPropertyUiState";
import { useSearchParams } from "react-router";
import { SubHeading } from "../../../theming/components/SubHeading";
import { PropertyMap, PropertyMapUiState } from "../../../common/property-components/PropertyMap";
import {
  selectAcceptedCount,
  selectHasAcceptedApplications,
} from "../../../review-tenant-modal/state/reducers/tenant-selection-slice";
import { fetchAgentWithProfile } from '../state/reducers/tenant-property-slice';
import { AgentDetails } from '../components/AgentDetails';

export function TenantProperty({
  className = "",
}: {
  className?: string;
}): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const dispatch = useAppDispatch();
  const state: TenantPropertyUiState = useSelector(
    selectTenantPropertyUiState
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
        <PropertyPageContentLoadingSkeleton
          className={twMerge("p-5", className)}
        />
      </>
    );
  } else {
    return (
      <>
        <PropertyPageContent
          streetNumber={state.streetNumber}
          street={state.street}
          suburb={state.suburb}
          province={state.province}
          postcode={state.postcode}
          summaryDescription={state.summaryDescription}
          propertyStatusText={state.propertyStatusText}
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

function PropertyPageContent({
  streetNumber,
  street,
  suburb,
  province,
  postcode,
  summaryDescription,
  propertyStatusText,
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

  const acceptedCount = useAppSelector(selectAcceptedCount);
  const hasAcceptedApplications = useAppSelector(selectHasAcceptedApplications);
  const shouldShowSendToLandlordButton = hasAcceptedApplications;

  return (
    <div className={className}>
      <TopBar
        listingStatusText={listingStatusText}
        shouldDisplayListingStatus={shouldDisplayListingStatus}
        onBack={onBack}
        className="mb-3"
      />
      <PropertyHero
        streetNumber={streetNumber}
        street={street}
        suburb={suburb}
        province={province}
        postcode={postcode}
        summaryDescription={summaryDescription}
        propertyStatusText={propertyStatusText}
        propertyType={propertyType}
        propertyLandArea={propertyLandArea}
        propertyBathrooms={propertyBathrooms}
        propertyParkingSpaces={propertyParkingSpaces}
        propertyBedrooms={propertyBedrooms}
        propertyPrice={propertyPrice}
        listingImageUrls={listingImageUrls}
        onApply={onApply}
        propertyId={propertyId}
        onContactAgent={onContactAgent}
        className="mb-6"
      />
      <PropertyDetails
        propertyDescription={propertyDescription}
        mapUiState={mapUiState}
        inspectionBookingUiStateList={inspectionBookingUiStateList}
        onBook={onBook}
        propertyFeatures={propertyFeatures}
        propertyId={propertyId} // Pass the propertyId to ListingDetails
        className="mb-6"
      />
    </div>
  );
}

function PropertyPageContentLoadingSkeleton({
  className = "",
}: {
  className?: string;
}): React.JSX.Element {
  return <p className={className}>Loading...</p>;
}

function TopBar({
  listingStatusText,
  shouldDisplayListingStatus,
  onBack,
  className = "",
}: {
  listingStatusText: string;
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
    </div>
  );
}

function PropertyHero({
  className = "",
  streetNumber,
  street,
  suburb,
  province,
  postcode,
  summaryDescription,
  propertyStatusText,
  propertyType,
  propertyLandArea,
  propertyBathrooms,
  propertyParkingSpaces,
  propertyBedrooms,
  propertyPrice,
  listingImageUrls,
  propertyId,
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
  propertyType: string;
  propertyLandArea: string;
  propertyBathrooms: string;
  propertyParkingSpaces: string;
  propertyBedrooms: string;
  propertyPrice: string;
  listingImageUrls: string[];
  propertyId: string;
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
        <h1 className="text-3xl font-semibold mb-4">My Property</h1>
        <PropertySummary
          streetNumber={streetNumber}
          street={street}
          suburb={suburb}
          province={province}
          postcode={postcode}
          summaryDescription={summaryDescription}
          propertyStatusText={propertyStatusText}
          className="mb-2"
        />
        <PropertySpecifics
          propertyType={propertyType}
          area={propertyLandArea}
          bathrooms={propertyBathrooms}
          parking={propertyParkingSpaces}
          bedrooms={propertyBedrooms}
          price={propertyPrice}
          className="w-full mb-8"
        />
      </div>
    </div>
  );
}

function PropertyDetails({
  propertyDescription,
  mapUiState,
  inspectionBookingUiStateList,
  onBook,
  propertyFeatures,
  propertyId,
  className = "",
}: {
  propertyDescription: string;
  mapUiState: PropertyMapUiState;
  inspectionBookingUiStateList: InspectionBookingListUiState[];
  onBook: (index: number) => void;
  propertyFeatures: string[];
  propertyId: string;
  className?: string;
}): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { agent, agentProfile, isLoadingAgent, agentError } = useAppSelector(
    (state) => state.tenantProperty
  );

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchAgentWithProfile(propertyId))
        .unwrap()
        .catch((error) => {
          console.error('Failed to fetch agent details:', error);
        });
    }
  }, [dispatch, propertyId]);

  return (
    <div className={twMerge("flex flex-col gap-7", className)}>
      <div className="flex gap-7">
        <div className="flex-1 flex flex-col">
          <PropertyDescription
            description={propertyDescription}
            className="mb-4"
          />
          <PropertyInspections
            bookingUiStateList={inspectionBookingUiStateList}
            onBook={onBook}
            className="w-full"
          />
          <AgentDetails
          agent={agent}
          profile={agentProfile}
          isLoading={isLoadingAgent}
          error={agentError}
          className="flex-1"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <PropertyFeatures featuresList={propertyFeatures} className="mb-4" />
          <SubHeading text="Location" className="mb-2" />
          <PropertyMap mapUiState={mapUiState} />
        </div>
      </div>
    </div>
  );
}
