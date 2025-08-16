import React from 'react';
import { TenantApplication } from '../types/TenantApplication';
import { TenantApplicationCard } from './TenantApplicationCard';
import {UserAccount} from '/app/client/library-modules/domain-models/user/UserAccount';
import { Role } from '/app/shared/user-role-identifier';

type ModalContentProps = {
  tenantApplications: TenantApplication[];
  onReject: (applicationId: string) => void;
  onAccept: (applicationId: string) => void;
  onSendToLandlord: (applicationId: string) => void;
  userRole: UserAccount["role"]
  // onBackgroundPass: (applicationId: string) => void;
  // onBackgroundFail: (applicationId: string) => void;
}

export function ModalContent({
  tenantApplications,
  onReject,
  onAccept,
  userRole,
  onSendToLandlord,
  // onBackgroundPass,
  // onBackgroundFail,
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
            onSendToLandlord = {onSendToLandlord}
            userRole={userRole}
            // onBackgroundPass={onBackgroundPass}
            // onBackgroundFail={onBackgroundFail}
          />
        ))}
      </div>
    </div>
  );
}
