import React, { useEffect, useState } from "react";
import { PropertyFeatures } from "/app/client/ui-modules/common/property-components/PropertyFeatures";
import { PropertySpecifics } from "/app/client/ui-modules/common/property-components/PropertySpecifics";
import {
  PropertyStatusPillVariant,
  ListingSummary,
} from "./components/ListingSummary";
import { PropertyDescription } from "/app/client/ui-modules/common/property-components/PropertyDescription";
import { LeftCircularArrowIcon } from "/app/client/ui-modules/theming/icons/LeftCircularArrowIcon";
import { RightCircularArrowIcon } from "/app/client/ui-modules/theming/icons/RightCircularArrowIcon";
import { ImageCarousel } from "../theming/components/ImageCarousel";
import {
  InspectionBookingListUiState,
  PropertyInspections,
} from "./components/PropertyInspections";
import { ApplyButton } from "/app/client/ui-modules/property-listing-page/components/ApplyButton";
import { ContactAgentButton } from "/app/client/ui-modules/common/property-components/ContactAgentButton";
import {
  ListingStatusPill,
  ListingStatusPillVariant,
} from "/app/client/ui-modules/property-listing-page/components/ListingStatusPill";
import { BackLink } from "../theming/components/BackLink";
import { BackButtonIcon } from "/app/client/ui-modules/theming/icons/BackButtonIcon";
import { twMerge } from "tailwind-merge";
import { SubmitDraftListingButton } from "/app/client/ui-modules/property-listing-page/components/SubmitDraftListingButton";
import { ReviewTenantButton } from "/app/client/ui-modules/property-listing-page/components/ReviewTenantButton";
import { TenantSelectionModal } from "/app/client/ui-modules/tenant-selection/TenantSelectionModal";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import { useSelector } from "react-redux";
import {
  bookPropertyInspectionAsync,
  load,
  selectPropertyListingUiState,
  submitDraftListingAsync,
} from "/app/client/ui-modules/property-listing-page/state/reducers/property-listing-slice";

import { PropertyListingPageUiState } from "/app/client/ui-modules/property-listing-page/state/PropertyListingUiState";
import { useNavigate, useSearchParams } from "react-router";
import EditDraftListingModal from "./components/EditDraftListingModal";
import { EditDraftListingButton } from "./components/EditDraftListingButton";
import { FormSchemaType } from "/app/client/ui-modules/property-form-agent/components/FormSchema";
import { SubHeading } from "../theming/components/SubHeading";
import {
  PropertyMap,
  PropertyMapUiState,
} from "/app/client/ui-modules/common/property-components/PropertyMap";
import { NavigationPath } from "../../navigation";
import { BACK_ROUTES, EntryPoint } from "../../navigation";
import {
  selectAcceptedApplicantCountForProperty,
  selectHasAcceptedApplicationsForProperty,
  selectFilteredApplications,
  selectHasCurrentUserApplied,
  createTenantApplicationAsync,
  loadTenantApplicationsForPropertyAsync,
  selectLandlordApprovedApplicantCountForProperty,
  selectHasLandlordApprovedApplicationsForProperty,
  intentSendApplicationToAgentAsync,
  intentSendApplicationToLandlordAsync,
  selectHasBackgroundPassedApplicationsForProperty,
  selectBackgroundPassedApplicantCountForProperty,
  intentAcceptApplicationAsync,
  intentRejectApplicationAsync,
  selectHasFinalApprovedApplicationForProperty,
  selectFinalApprovedApplicantCountForProperty,
  sendFinalApprovedApplicationToAgentAsync,
  intentResetApplicationDecisionAsync,
} from "/app/client/ui-modules/tenant-selection/state/reducers/tenant-selection-slice";
import { addBookedPropertyListingInspection } from "./state/reducers/property-listing-slice";
import { Role } from "/app/shared/user-role-identifier";
import { CurrentUserState } from "../user-authentication/state/CurrentUserState";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";

export function PropertyListingPage({
  className = "",
}: {
  className?: string;
}): React.JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const dispatch = useAppDispatch();
  const state: PropertyListingPageUiState = useSelector(
    selectPropertyListingUiState
  );
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const profileData = useAppSelector((state) => state.currentUser.profileData);
  const authUser = useAppSelector((state) => state.currentUser.authUser);
  const role = useAppSelector((state) => state.currentUser.authUser?.role);
  useEffect(() => {
    if (!propertyId) {
      console.log("Property ID is not provided, loading default property");
      dispatch(load("1"));
      return;
    }
    console.log(`Loading property with ID: ${propertyId}`);
    dispatch(load(propertyId));
  }, []);

  // Load tenant applications when property loads
  useEffect(() => {
    if (propertyId && authUser) {
      dispatch(loadTenantApplicationsForPropertyAsync(propertyId));
    }
  }, [propertyId, authUser]);

  if (state.shouldShowLoadingState) {
    return (
      <ListingPageContentLoadingSkeleton
        className={twMerge("p-5", className)}
      />
    );
  } else {
    return (
      <>
        <ListingPageContent
          propertyId={state.propertyId}
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
          bookedPropertyListingInspections={
            state.bookedPropertyListingInspections
          }
          listingImageUrls={state.listingImageUrls}
          listingStatusText={state.listingStatusText}
          listingStatusPillVariant={state.listingStatusPillVariant}
          shouldDisplayListingStatus={state.shouldDisplayListingStatus}
          shouldDisplaySubmitDraftButton={state.shouldDisplaySubmitDraftButton}
          shouldDisplayReviewTenantButton={
            state.shouldDisplayReviewTenantButton
           && (role === Role.LANDLORD || role === Role.AGENT)}
          shouldDisplayEditListingButton={state.shouldDisplayEditListingButton}
          authUser={authUser}
          profileData={profileData}
          tenantId={currentUser?.userAccountId}
          onBack={() => {
            const from = searchParams.get("from") as EntryPoint | null;
            if (from && from in BACK_ROUTES) {
              navigate(BACK_ROUTES[from]);
            } else {
              navigate(NavigationPath.Home);
            }
          }}
          onBook={(inspectionId: string) => {
            console.log(`booking inspection with id ${inspectionId}`);
            dispatch(addBookedPropertyListingInspection(inspectionId));

            const inspection = state.inspectionBookingUiStateList.find(
              (i) => i._id === inspectionId
            );

            if (inspection && currentUser?.userAccountId) {
              dispatch(
                bookPropertyInspectionAsync({
                  inspectionId,
                  tenantId: currentUser.userAccountId,
                })
              );
            }
          }}
          onApply={async () => {
            console.log("Apply button clicked!");
            console.log("Current user:", currentUser);
            console.log("Profile data:", profileData);

            try {
              const result = await dispatch(
                createTenantApplicationAsync()
              ).unwrap();
              console.log("Tenant application created successfully:", result);
              alert(result.message);
            } catch (error) {
              console.error("Failed to create tenant application:", error);
              alert(
                error instanceof Error
                  ? error.message
                  : "Failed to submit application. Please try again."
              );
            }
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
  propertyId,
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
  authUser,
  profileData, // will move these elsewhere
  onBack,
  onBook,
  onApply,
  onContactAgent,
  onSubmitDraftListing,
  bookedPropertyListingInspections,
  className = "",
  tenantId,
}: {
  propertyId: string;
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
  authUser: CurrentUserState["authUser"];
  profileData: CurrentUserState["profileData"];
  onBack: () => void;
  onBook: (inspectionId: string) => void;
  onApply: () => void;
  onContactAgent: () => void;
  onSubmitDraftListing: () => void;
  bookedPropertyListingInspections?: number[];
  className?: string;
  tenantId?: string;
}): React.JSX.Element {
  const [isReviewTenantModalOpen, setIsReviewTenantModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const tenantApplications = useAppSelector((state) =>
    selectFilteredApplications(state, propertyId)
  );
  const isCreatingApplication = useAppSelector(
    (state) => state.tenantSelection.isLoading
  );

  const acceptedApplicantCount = useAppSelector((state) =>
    selectAcceptedApplicantCountForProperty(state, propertyId)
  );
  const hasAcceptedApplications = useAppSelector((state) =>
    selectHasAcceptedApplicationsForProperty(state, propertyId)
  );

  // Get current user's name for checking if they've already applied
  const currentUserName = profileData
    ? `${profileData.firstName} ${profileData.lastName}`
    : undefined;
  const hasCurrentUserApplied = useAppSelector((state) =>
    selectHasCurrentUserApplied(state, propertyId, currentUserName)
  );

  // Step 2 selectors for landlord approved applications
  const hasLandlordApprovedApplications = useAppSelector((state) =>
    selectHasLandlordApprovedApplicationsForProperty(state, propertyId)
  );
  const landlordApprovedApplicantCount = useAppSelector((state) =>
    selectLandlordApprovedApplicantCountForProperty(state, propertyId)
  );

  const hasBackgroundPassedApplications = useAppSelector((state) =>
    selectHasBackgroundPassedApplicationsForProperty(state, propertyId)
  );
  const backgroundPassedApplicantCount = useAppSelector((state) =>
    selectBackgroundPassedApplicantCountForProperty(state, propertyId)
  );

  const shouldShowSendToLandlordButton =
    (hasAcceptedApplications || hasBackgroundPassedApplications) &&
    authUser?.role === Role.AGENT;
  const shouldShowSendToAgentButton =
    hasLandlordApprovedApplications && authUser?.role === Role.LANDLORD;

  const hasFinalApprovedApplications = useAppSelector((state) =>
    selectHasFinalApprovedApplicationForProperty(state, propertyId)
  );
  const finalApprovedApplicantCount = useAppSelector((state) =>
    selectFinalApprovedApplicantCountForProperty(state, propertyId)
  );
  const shouldShowSendFinalApprovedToAgentButton =
    hasFinalApprovedApplications && authUser?.role === Role.LANDLORD;

  const handleAccept = async (applicationId: string) => {
    try {
      await dispatch(
        intentAcceptApplicationAsync({ propertyId, applicationId })
      ).unwrap();
    } catch (error) {
      console.error("Failed to accept application:", error);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await dispatch(
        intentRejectApplicationAsync({ propertyId, applicationId })
      ).unwrap();
    } catch (error) {
      console.error("Failed to reject application:", error);
    }
  };
  const handleReset = async (applicationId: string, currentStatus: TenantApplicationStatus) => {
    try {
      const result = await dispatch(intentResetApplicationDecisionAsync({
        applicationId: [applicationId],
        currentStatus: currentStatus
      })).unwrap();
      console.log(`Application ${applicationId} reset successfully`);
    } catch (error) {
      console.error("Failed to reset application:", error);
    }
  };

  const handleSendToLandlord = async () => {
    try {
      await dispatch(intentSendApplicationToLandlordAsync()).unwrap();
      console.log("Successfully sent applications to landlord");
    } catch (error) {
      console.error("Failed to send applications to landlord:", error);
    }
  };

  const handleSendToAgent = async () => {
    try {
      await dispatch(intentSendApplicationToAgentAsync()).unwrap();
      console.log("Successfully sent applications to agent");
    } catch (error) {
      console.error("Failed to send applications to agent:", error);
    }
  };

  const handleSendFinalApprovedToAgent = async () => {
    try {
      await dispatch(sendFinalApprovedApplicationToAgentAsync()).unwrap();
      console.log("Successfully sent final approved application to agent");
    } catch (error) {
      console.error(
        "Failed to send final approved application to agent:",
        error
      );
    }
  };

  return (
    <div className={twMerge("p-5", className)}>
      <TopBar
        listingStatusText={listingStatusText}
        listingStatusPillVariant={listingStatusPillVariant}
        shouldDisplayListingStatus={shouldDisplayListingStatus}
        onBack={onBack}
        className="mb-3"
      />
      <ListingHero
        propertyId={propertyId}
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
        isApplying={isCreatingApplication}
        userRole={authUser?.role}
        hasApplied={hasCurrentUserApplied}
        className="mb-6"
      />
      <ListingDetails
        propertyDescription={propertyDescription}
        mapUiState={mapUiState}
        inspectionBookingUiStateList={inspectionBookingUiStateList}
        onBook={(inspectionId: string) => {
          console.log(`Booking inspection with id ${inspectionId}`);
          dispatch(addBookedPropertyListingInspection(inspectionId));

          const inspection = inspectionBookingUiStateList.find(
            (i) => i._id === inspectionId
          );

          if (inspection && tenantId) {
            dispatch(
              bookPropertyInspectionAsync({
                inspectionId,
                tenantId: tenantId,
              })
            );
          }
        }}
        propertyFeatures={propertyFeatures}
        userRole={authUser?.role}
        bookedPropertyListingInspections={bookedPropertyListingInspections}
        className="mb-6"
        tenantId={tenantId}
      />
      <BottomBar
        shouldDisplaySubmitDraftButton={shouldDisplaySubmitDraftButton}
        shouldDisplayReviewTenantButton={shouldDisplayReviewTenantButton}
        shouldDisplayEditListingButton={shouldDisplayEditListingButton}
        onSubmitDraftListing={onSubmitDraftListing}
        onReviewTenant={() => setIsReviewTenantModalOpen(true)}
      />

      {authUser?.role === Role.AGENT && (
        <TenantSelectionModal
          role={Role.AGENT}
          isOpen={isReviewTenantModalOpen}
          onClose={() => setIsReviewTenantModalOpen(false)}
          onReject={handleReject}
          onAccept={handleAccept}
          onReset={handleReset}
          onSendToLandlord={handleSendToLandlord}
          shouldShowSendToLandlordButton={shouldShowSendToLandlordButton}
          acceptedApplicantCount={acceptedApplicantCount}
          backgroundPassedApplicantCount={backgroundPassedApplicantCount}
          hasAcceptedApplications={hasAcceptedApplications}
          tenantApplications={tenantApplications}
        />
      )}
      {authUser?.role === Role.LANDLORD && (
        <TenantSelectionModal
          role={Role.LANDLORD}
          isOpen={isReviewTenantModalOpen}
          onClose={() => setIsReviewTenantModalOpen(false)}
          onReject={handleReject}
          onAccept={handleAccept}
          onReset={handleReset}
          onSendToAgent={handleSendToAgent}
          onSendFinalApprovedToAgent={handleSendFinalApprovedToAgent}
          shouldShowSendToAgentButton={shouldShowSendToAgentButton}
          shouldShowSendFinalApprovedToAgentButton={
            shouldShowSendFinalApprovedToAgentButton
          }
          landlordApprovedApplicantCount={landlordApprovedApplicantCount}
          finalApprovedApplicantCount={finalApprovedApplicantCount}
          tenantApplications={tenantApplications}
        />
      )}
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
  propertyId,
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
  isApplying,
  userRole,
  hasApplied,
}: {
  propertyId: string;
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
  isApplying: boolean;
  userRole: Role | undefined;
  hasApplied: boolean;
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
        <PropertySpecifics
          propertyType={propertyType}
          area={propertyLandArea}
          bathrooms={propertyBathrooms}
          parking={propertyParkingSpaces}
          bedrooms={propertyBedrooms}
          price={propertyPrice}
          className="w-full mb-8"
        />
        <div className="flex">
          <ApplyButton
            onClick={onApply}
            isLoading={isApplying}
            userRole={userRole}
            hasApplied={hasApplied}
            className="mr-4"
          />
          <ContactAgentButton propertyId={propertyId} />
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
  userRole,
  bookedPropertyListingInspections,
  className = "",
  tenantId,
}: {
  propertyDescription: string;
  mapUiState: PropertyMapUiState;
  inspectionBookingUiStateList: InspectionBookingListUiState[];
  onBook: (inspectionId: string) => void;
  propertyFeatures: string[];
  userRole: Role | undefined;
  bookedPropertyListingInspections?: number[];
  className?: string;
  tenantId?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex gap-7", className)}>
      <div className="flex-1 flex flex-col">
        <PropertyDescription
          description={propertyDescription}
          className="mb-4"
        />
        <PropertyInspections
          bookingUiStateList={inspectionBookingUiStateList}
          onBook={onBook}
          userRole={userRole}
          className="w-full"
          tenantId={tenantId}
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
  ListingPageContent;
  return (
    <div
      className={twMerge("flex justify-between items-center gap-2", className)}
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
    agent: state.agentId,
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
    images: [], // Placeholder, as we don't have image files in the current state
    available_dates: new Date(),
    lease_term: "12_months",
    show_contact_boolean: true,
    suburb: state.suburb,
    address_number: state.streetNumber,
    monthly_rent: Number(state.propertyPrice),
    property_feature_ids: [],
    inspection_times: [],
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
        existingImageUrls={state.listingImageUrls}
      />
    </>
  );
}
