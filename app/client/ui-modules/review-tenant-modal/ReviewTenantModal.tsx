import React from 'react';
import { ReviewTenantModalProps } from './types/ReviewTenantModalProps';
import { FilterType } from './enums/FilterType';
import { ModalHeader } from './components/ModalHeader';
import { FilterTabs } from './components/FilterTabs';
import { ModalContent } from './components/ModalContent';
import { ModalDone } from './components/ModalDone';
import { Role } from '/app/shared/user-role-identifier';

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
  const handleReject = (applicationId: string) => {
    onReject(applicationId);
  };

  const handleAccept = (applicationId: string) => {
    onAccept(applicationId);
  };

  const handleSendToLandlord = () => {
    onSendToLandlord();
  };

  const handleFilterChange = (filter: FilterType) => {
    console.log('Filter changed to:', filter);
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
          userRole = {Role.AGENT}
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