import React from 'react';
import { ReviewTenantModalProps } from './types/ReviewTenantModalProps';
import { FilterType } from './enums/FilterType';
import { ModalHeader } from './components/ModalHeader';
import { FilterTabs } from './components/FilterTabs';
import { ModalContent } from './components/ModalContent';
import { ModalDone } from './components/ModalDone';
import { UserAccount} from '/app/client/library-modules/domain-models/user/UserAccount';
import { Role } from '/app/shared/user-role-identifier';
import { useAppDispatch } from '/app/client/store';
import {
  rejectTenantApplicationAsync,
  acceptTenantApplicationAsync,
  sendAcceptedApplicationsToLandlordAsync,
  setFilter,
} from './state/reducers/tenant-selection-slice';

export function ReviewTenantModal({
  isOpen,
  onClose,
  onReject,
  onAccept,
  onSendToLandlord,
  shouldShowSendToLandlordButton,
  acceptedCount,
  userRole,
  tenantApplications = [], // Receive applications as props instead of using useAppSelector
}: ReviewTenantModalProps): React.JSX.Element {
  const dispatch = useAppDispatch();

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
    <div className="fixed inset-0 bg-opacity-100 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-screen overflow-hidden shadow-xl">
        <ModalHeader onClose={onClose} />

        <FilterTabs
          activeFilter={FilterType.ALL}
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
          <div className="p-4 border-t">
            <button
              onClick={handleSendToLandlord}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Send {acceptedCount} Accepted Applicant(s) to Landlord
            </button>
          </div>
        )}

        <ModalDone onClose={onClose} />
      </div>
    </div>
  );
}