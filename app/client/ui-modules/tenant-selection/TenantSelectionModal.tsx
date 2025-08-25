import React from 'react';
import { TenantSelectionModalProps } from './types/TenantSelectionModalProps';
import { FilterType } from './enums/FilterType';
import { ModalHeader } from './components/ModalHeader';
import { FilterTabs } from './components/FilterTabs';
import { ModalContent } from './components/ModalContent';
import { ModalDone } from './components/ModalDone';
import { useAppDispatch, useAppSelector } from '/app/client/store';
import {
  sendAcceptedApplicationsToLandlordAsync,
  setFilter,
  selectActiveFilter,
} from './state/reducers/tenant-selection-slice';

export const TenantSelectionModal = ({
  isOpen,
  onClose,
  onReject,
  onAccept,
  onSendToLandlord,
  shouldShowSendToLandlordButton,
  acceptedApplicantCount,
  userRole,
  tenantApplications = [], // Receive applications as props
}: TenantSelectionModalProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const activeFilter = useAppSelector(selectActiveFilter);
  const isLoading = useAppSelector((state) => state.tenantSelection.isLoading);
  const error = useAppSelector((state) => state.tenantSelection.error);

  const handleReject = (applicationId: string) => {
    onReject(applicationId);
  };

  const handleAccept = (applicationId: string) => {
    onAccept(applicationId);
  };

  const handleSendToLandlord = () => {
    dispatch(sendAcceptedApplicationsToLandlordAsync());
    onSendToLandlord();
  };

  const handleFilterChange = (filter: FilterType) => {
    dispatch(setFilter(filter));
  };

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 bg-opacity-100 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-screen overflow-hidden shadow-xl">
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
          tenantApplications={tenantApplications}
          onReject={handleReject}
          onAccept={handleAccept}
          userRole={userRole}
        />

         {/* Send accepted applicants to landlord button */}
         {shouldShowSendToLandlordButton && (
          <div className="p-4 border-t">
            <button
              onClick={handleSendToLandlord}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send {acceptedApplicantCount} Accepted Applicant(s) to Landlord
            </button>
          </div>
        )}

        <ModalDone onClose={onClose} />
      </div>
    </div>
  );
}