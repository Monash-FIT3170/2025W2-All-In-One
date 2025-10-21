import React from "react";
import { TenantSelectionModalProps } from "./TenantSelectionModalProps";
import { Role } from "/app/shared/user-role-identifier";
import { FilterType } from "./enums/FilterType";
import { ModalHeader } from "./components/ModalHeader";
import { FilterTabs } from "./components/FilterTabs";
import { ModalContent } from "./components/ModalContent";
import { ModalDone } from "./components/ModalDone";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import {
  setFilter,
  selectActiveFilter,
} from "./state/reducers/tenant-selection-slice";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";
import { useTenantApplicationSubscriptions } from "./hooks/useTenantApplicationSubscriptions";

export const TenantSelectionModal = (
  props: TenantSelectionModalProps
): React.JSX.Element => {
  const {
    isOpen,
    onClose,
    onReject,
    onAccept,
    onReset,
    tenantApplications = [],
    propertyId,
  } = props;
  const dispatch = useAppDispatch();
  const activeFilter = useAppSelector(selectActiveFilter);
  const isLoading = useAppSelector((state) => state.tenantSelection.isLoading);
  const error = useAppSelector((state) => state.tenantSelection.error);

  // Use real-time subscriptions for tenant applications
  const { applications: realTimeApplications } =
    useTenantApplicationSubscriptions({
      enabled: isOpen, // Only subscribe when modal is open
      propertyId: propertyId,
      statusUpdatesOnly: false,
    });

  // Use real-time data if available, otherwise fall back to props
  const finalTenantApplications =
    realTimeApplications.length > 0 ? realTimeApplications : tenantApplications;

  const handleReject = (applicationId: string) => {
    onReject(applicationId);
  };

  const handleAccept = (applicationId: string) => {
    onAccept(applicationId);
  };

  const handleReset = async (
    applicationId: string,
    currentStatus: TenantApplicationStatus
  ) => {
    onReset(applicationId, currentStatus);
  };

  const handleSendToLandlord = () => {
    if (props.role === Role.AGENT) {
      props.onSendToLandlord();
    }
  };

  const handleSendToAgent = () => {
    if (props.role === Role.LANDLORD) {
      props.onSendToAgent();
    }
  };

  const handleSendFinalApprovedToAgent = () => {
    if (props.role === Role.LANDLORD) {
      props.onSendFinalApprovedToAgent();
    }
  };

  const handleFilterChange = (filter: FilterType) => {
    dispatch(setFilter(filter));
  };

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-6 max-h-[90vh] overflow-hidden">
        <ModalHeader onClose={onClose} />

        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Error Display */}
        {error && (
          <div className="px-4 py-2 bg-red-100 border border-red-400 text-red-700 rounded mx-4 mb-2">
            {error}
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-gray-600">Processing...</div>
          </div>
        )}

        <ModalContent
          tenantApplications={finalTenantApplications}
          onReject={handleReject}
          onAccept={handleAccept}
          onReset={handleReset}
          userRole={props.role}
        />

        {/* Agent-only button */}
        {props.role === Role.AGENT && props.shouldShowSendToLandlordButton && (
          <div className="p-4 border-t">
            <button
              onClick={handleSendToLandlord}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send{" "}
              {props.hasAcceptedApplications
                ? props.acceptedApplicantCount
                : props.backgroundPassedApplicantCount}{" "}
              {props.hasAcceptedApplications ? "Accepted" : "Background Passed"}{" "}
              Applicant(s) to Landlord
            </button>
          </div>
        )}

        {/* Landlord-only button */}
        {props.role === Role.LANDLORD && props.shouldShowSendToAgentButton && (
          <div className="p-4 border-t">
            <button
              onClick={handleSendToAgent}
              disabled={isLoading}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send {props.landlordApprovedApplicantCount} Approved Applicant(s)
              to Agent for Background Check
            </button>
          </div>
        )}

        {/* Landlord final approved button */}
        {props.role === Role.LANDLORD &&
          props.shouldShowSendFinalApprovedToAgentButton && (
            <div className="p-4 border-t">
              <button
                onClick={handleSendFinalApprovedToAgent}
                disabled={isLoading}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Send {props.finalApprovedApplicantCount} Final Approved
                Applicant to Agent
              </button>
            </div>
          )}

        <ModalDone onClose={onClose} />
      </div>
    </div>
  );
};
