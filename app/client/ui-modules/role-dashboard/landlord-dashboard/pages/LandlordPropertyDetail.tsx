import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { PropertyWithListingDataAndNames } from "../state/landlord-properties-slice";
import { PropertyStatus } from "/app/shared/api-models/property/PropertyStatus";
import { NavigationPath } from "/app/client/navigation";
import { StatusBadge } from "../../components/StatusBadge";
import { ReviewTenantButton } from "/app/client/ui-modules/property-listing-page/components/ReviewTenantButton";
import { useTenantApplicationReview } from '/app/client/ui-modules/tenant-selection/hooks/useTenantApplicationReview';
import { useTenantApplicationSubscriptions } from '/app/client/ui-modules/tenant-selection/hooks/useTenantApplicationSubscriptions';
import { TenantSelectionModal } from "/app/client/ui-modules/tenant-selection/TenantSelectionModal";
import { Role } from "/app/shared/user-role-identifier";
import { useAppSelector } from "/app/client/store";
import { DynamicMap } from "../../../common/map/DynamicMap";
import { BasicMarker } from "../../../common/map/markers/BasicMarker";

export function LandlordPropertyDetail(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Financial");
  const authUser = useAppSelector((state) => state.currentUser.authUser);

  // Get property from router state (passed from PropertyCard)
  const passedProperty = location.state?.property as PropertyWithListingDataAndNames;

  // Use the tenant application review hook
  const {
    isModalOpen,
    setIsModalOpen,
    tenantApplications,
    landlordApprovedApplicantCount,
    finalApprovedApplicantCount,
    shouldShowSendToAgentButton,
    shouldShowSendFinalApprovedToAgentButton,
    handleAccept,
    handleReject,
    handleReset,
    handleSendToAgent,
    handleSendFinalApprovedToAgent,
  } = useTenantApplicationReview(passedProperty?.propertyId || "", authUser?.role || Role.LANDLORD);

  // Use real-time subscriptions for tenant applications
  const {
    applications: realTimeApplications,
    applicationsReady
  } = useTenantApplicationSubscriptions({
    enabled: true, // Always enabled for landlord to see updates
    propertyId: passedProperty?.propertyId,
    statusUpdatesOnly: false
  });

  // Use real-time data if available, otherwise fall back to Redux data
  const finalTenantApplications = realTimeApplications.length > 0 ? realTimeApplications : tenantApplications;

  const handleBackToProperties = () => {
    navigate(NavigationPath.LandlordProperties);
  };

  // Show simple return button if no property data is passed
  if (!passedProperty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">No Property Data</h3>
          <button
            onClick={handleBackToProperties}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const isVacant = passedProperty.propertyStatus === PropertyStatus.VACANT;
  const displayImageUrl = passedProperty.image_urls?.[0];
  const fullAddress = `${passedProperty.streetnumber} ${passedProperty.streetname}`;
  const fullLocation = `${fullAddress}, ${passedProperty.suburb}, ${passedProperty.province}`;

  const tabs = ["Financial", "Documents"];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToProperties}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Properties
            </button>
            <div className="text-xl font-bold text-gray-900">{fullAddress}</div>
            <div className="text-xl text-gray-900">{passedProperty.suburb}, {passedProperty.province}</div>
          </div>

          {/* Status Badge - positioned on the far right */}
          <div>
            <StatusBadge status={passedProperty.propertyStatus as PropertyStatus} />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Left Column - Property Image and Details */}
            <div className="lg:col-span-3">
              {/* Property Image */}
              <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                {displayImageUrl ? (
                  <img
                    src={displayImageUrl}
                    alt={`Property at ${fullAddress}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-4a1 1 0 011-1h4a1 1 0 011 1v4m-5 0h10" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Property Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="ml-2 font-medium">{passedProperty.type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Bedrooms:</span>
                      <span className="ml-2 font-medium">{passedProperty.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Bathrooms:</span>
                      <span className="ml-2 font-medium">{passedProperty.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Parking:</span>
                      <span className="ml-2 font-medium">{passedProperty.parking}</span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Rent:</span>
                      <span className="ml-2 font-medium">${passedProperty.pricePerMonth.toLocaleString()}/month</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Tenant:</span>
                      <span className="ml-2 font-medium">
                        {passedProperty.tenantName || (isVacant ? "None" : "Unknown")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Lease Start:</span>
                      <span className="ml-2 font-medium">{isVacant ? "Not leased" : "Active"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Agent:</span>
                      <span className="ml-2 font-medium">
                        {passedProperty.agentName || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {passedProperty.description && (
                  <div className="mt-4">
                    <h3 className="text-base font-medium mb-2">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{passedProperty.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Location */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-semibold mb-3">Location</h3>
                <DynamicMap
                  initialMapCoordinates={{
                      initialLatitude: passedProperty.locationLatitude,
                      initialLongitude: passedProperty.locationLongitude
                  }}
                  markers={[<BasicMarker key={0} latitude={passedProperty.locationLatitude} longitude={passedProperty.locationLongitude} />]}
                  className="h-64 w-full mb-3"
                />
                <div className="flex items-start">
                  <svg className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 616 0z" />
                  </svg>
                  <span className="text-xs text-gray-600 leading-tight">{fullLocation}</span>
                </div>
              </div>

              {/* Tenant Selection */}
              {finalTenantApplications && finalTenantApplications.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <svg className="h-4 w-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="text-base font-semibold">Tenant Selection</h3>
                  </div>

                  <div className="text-center py-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-xs text-blue-800 font-medium mb-1">Action Required</p>
                      <p className="text-xs text-blue-700">You have potential tenants waiting for your review</p>
                    </div>

                    <ReviewTenantButton
                      onClick={() => setIsModalOpen(true)}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === "Financial" && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-4">Financial Information</h3>

                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-600">Monthly Rent</span>
                      <p className="text-lg font-semibold">${passedProperty.pricePerMonth.toLocaleString()}/month</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Payment Due Date</span>
                      <p className="text-lg font-semibold">1st of every month</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Documents" && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-4">Documents</h3>
                  <div className="text-center py-6 text-gray-500">
                    <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">No documents uploaded yet</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Selection Modal */}
      {authUser?.role === Role.LANDLORD && (
        <TenantSelectionModal
          role={Role.LANDLORD}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onReject={handleReject}
          onAccept={handleAccept}
          onReset={handleReset}
          onSendToAgent={handleSendToAgent}
          onSendFinalApprovedToAgent={handleSendFinalApprovedToAgent}
          shouldShowSendToAgentButton={shouldShowSendToAgentButton}
          shouldShowSendFinalApprovedToAgentButton={shouldShowSendFinalApprovedToAgentButton}
          landlordApprovedApplicantCount={landlordApprovedApplicantCount}
          finalApprovedApplicantCount={finalApprovedApplicantCount}
          tenantApplications={finalTenantApplications}
          propertyId={passedProperty?.propertyId}
        />
      )}
    </div>
  );
}