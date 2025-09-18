import React from 'react';
import { TenantApplication } from "/app/client/library-modules/domain-models/tenant-application/TenantApplication";
import { TenantApplicationCard } from './TenantApplicationCard';
import { UserAccount } from '/app/client/library-modules/domain-models/user/UserAccount';
import { TenantApplicationStatus } from '/app/shared/api-models/tenant-application/TenantApplicationStatus';

type ModalContentProps = {
  tenantApplications: TenantApplication[];
  onReject: (applicationId: string) => void;
  onAccept: (applicationId: string) => void;
  onReset: (applicationId: string, currentStatus: TenantApplicationStatus) => void;
  userRole?: UserAccount["role"];
}

export function ModalContent({
  tenantApplications,
  onReject,
  onAccept,
  onReset,
  userRole,
}: ModalContentProps): React.JSX.Element {
  return (
    <div className="overflow-y-auto max-h-96 px-4 py-2">
      {tenantApplications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No applications found for the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tenantApplications.map((application) => (
            <TenantApplicationCard
              key={application.id}
              application={application}
              onReject={onReject}
              onAccept={onAccept}
              onReset={onReset}
              userRole={userRole}
            />
          ))}
        </div>
      )}
    </div>
  );
}
