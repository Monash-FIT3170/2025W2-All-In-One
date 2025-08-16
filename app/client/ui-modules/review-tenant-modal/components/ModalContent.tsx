import React from 'react';
import { TenantApplication } from '../types/TenantApplication';
import { TenantApplicationCard } from './TenantApplicationCard';
import {UserAccount} from '/app/client/library-modules/domain-models/user/UserAccount';
import { Role } from '/app/shared/user-role-identifier';

type ModalContentProps = {
  tenantApplications: TenantApplication[];
  onReject: (applicationId: string) => void;
  onAccept: (applicationId: string) => void;
  userRole: UserAccount["role"]
  // onBackgroundPass: (applicationId: string) => void;
  // onBackgroundFail: (applicationId: string) => void;
  // onSendToLandlord: (applicationId: string) => void; // Removed - handled at modal level
}

export function ModalContent({
  tenantApplications,
  onReject,
  onAccept,
  userRole = Role.AGENT,
  // onBackgroundPass,
  // onBackgroundFail,
  // onSendToLandlord, // Removed
}: ModalContentProps): React.JSX.Element {
  return (
    <div className="overflow-y-auto max-h-100 px-4">
      <div className="space-y-3">
        {tenantApplications.map((application) => (
          <TenantApplicationCard
            key={application.id}
            application={application}
            onReject={onReject}
            onAccept={onAccept}
            // onBackgroundPass={onBackgroundPass}
            // onBackgroundFail={onBackgroundFail}
            // onSendToLandlord={onSendToLandlord} // Removed
          />
        ))}
      </div>
    </div>
  );
}
