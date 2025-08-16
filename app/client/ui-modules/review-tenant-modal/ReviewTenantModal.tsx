import React from 'react';
import { ReviewTenantModalProps } from './types/ReviewTenantModalProps';
import { FilterType } from './enums/FilterType';
import { ModalHeader } from './components/ModalHeader';
import { FilterTabs } from './components/FilterTabs';
import { ModalContent } from './components/ModalContent';
import { ModalDone } from './components/ModalDone';
import { UserAccount} from '/app/client/library-modules/domain-models/user/UserAccount';
import { Role } from '/app/shared/user-role-identifier';
import { useAppDispatch, useAppSelector } from '/app/client/store';
import {
  rejectTenantApplicationAsync,
  acceptTenantApplicationAsync,
  sendAcceptedApplicationsToLandlordAsync,
  setFilter,
  selectActiveFilter,
} from './state/reducers/tenant-selection-slice';

export function ReviewTenantModal({
  isOpen,
  onClose,
  onReject,
  onAccept,
  onSendToLandlord,
  shouldShowSendToLandlordButton,
  acceptedApplicantCount,
  userRole,
  tenantApplications = [], // Receive applications as props instead of using useAppSelector
}: ReviewTenantModalProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const activeFilter = useAppSelector(selectActiveFilter);

  const handleReject = (applicationId: string) => {
    dispatch(rejectTenantApplicationAsync(applicationId));
    onReject(applicationId);
  };

  const handleAccept = (applicationId: string) => {
    dispatch(acceptTenantApplicationAsync(applicationId));
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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-hidden shadow-2xl">
        <ModalHeader onClose={onClose} />

        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        <ModalContent
          tenantApplications={tenantApplications}
          onReject={handleReject}
          onAccept={handleAccept}
          onSendToLandlord={(applicationId: string) => {
            // This could be used for individual application actions if needed
            console.log(`Send individual application ${applicationId} to landlord`);
          }}
          userRole={userRole}
        />

         {/* Send accepted applicants to landlord button */}
         {shouldShowSendToLandlordButton && (
          <div className="p-4 border-t bg-gray-50">
            <button
              onClick={handleSendToLandlord}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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