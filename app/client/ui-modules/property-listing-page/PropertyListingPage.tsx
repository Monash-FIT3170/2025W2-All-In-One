import React from "react";
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

// TODO: The state here is temporary. During server data integration, this should be moved to a redux slice.
export function PropertyListingPage({
  className = "",
}: {
  className?: string;
}): React.JSX.Element {
  return (
    <ListingPageContent
      streetNumber="86"
      street="Fury Lane"
      suburb="Toorak"
      province="VIC"
      postcode="3166"
      summaryDescription="The house of your dreams, yadda yadda yes this house is very lorem ipsum."
      propertyStatusText="Vacant"
      propertyStatusPillVariant={PropertyStatusPillVariant.VACANT}
      propertyDescription="Modern apartment with spacious living areas and a beautiful garden. Recently renovated with new
        appliances and fixtures throughout. The property features an open-plan kitchen and dining area that flows
        onto a private balcony with city views. The master bedroom includes an ensuite bathroom and built-in
        wardrobes, while the second bedroom is generously sized and located near the main bathroom."
      propertyFeatures={[
        "Pool",
        "Gym",
        "Garage",
        "Pet friendly",
        "Washing machine",
        "Shed",
        "Lots of grass",
      ]}
      propertyType="Apartment"
      propertyLandArea="500m²"
      propertyBathrooms="2"
      propertyParkingSpaces="2"
      propertyBedrooms="4"
      propertyPrice="$1500/mth"
      inspectionBookingUiStateList={[
        {
          date: "21st Jan 2025",
          startingTime: "11:25pm",
          endingTime: "11:55pm",
        },
        {
          date: "22nd Jan 2025",
          startingTime: "1:20pm",
          endingTime: "1:50pm",
        },
      ]}
      listingImageUrls={[
        "https://cdn.pixabay.com/photo/2018/08/04/11/30/draw-3583548_1280.png",
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
        "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
      ]}
      listingStatusText="DRAFT LISTING"
      listingStatusPillVariant={ListingStatusPillVariant.DRAFT}
      shouldDisplayListingStatus={true}
      shouldDisplaySubmitDraftButton={true}
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
      onSubmitDraftListing={() => console.log("draft submitted!")}
      className={twMerge("p-5", className)}
    />
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
  inspectionBookingUiStateList: InspectionBookingListUiState[];
  listingImageUrls: string[];
  listingStatusText: string;
  listingStatusPillVariant: ListingStatusPillVariant;
  shouldDisplayListingStatus: boolean;
  shouldDisplaySubmitDraftButton: boolean;
  onBack: () => void;
  onBook: (index: number) => void;
  onApply: () => void;
  onContactAgent: () => void;
  onSubmitDraftListing: () => void;
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
        onSubmitDraftListing={onSubmitDraftListing}
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
  onSubmitDraftListing,
  className = "",
}: {
  shouldDisplaySubmitDraftButton: boolean;
  onSubmitDraftListing: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex", className)}>
      {shouldDisplaySubmitDraftButton && (
        <SubmitDraftListingButton
          onClick={onSubmitDraftListing}
          className="ml-auto"
        />
      )}
    </div>
  );
}
