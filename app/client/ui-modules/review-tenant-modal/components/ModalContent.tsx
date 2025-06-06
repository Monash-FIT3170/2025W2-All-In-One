import React from 'react';
import { TenantApplication } from '../types/TenantApplication';
import { TenantApplicationCard } from './TenantApplicationCard';

type ModalContentProps = {
  applications: TenantApplication[];
  onReject: (applicationId: string) => void;
  onProgress: (applicationId: string) => void;
  onBackgroundPass: (applicationId: string) => void;
  onBackgroundFail: (applicationId: string) => void;
  onSendToLandlord: (applicationId: string) => void;
}

export function ModalContent({
  applications,
  onReject,
  onProgress,
  onBackgroundPass,
  onBackgroundFail,
  onSendToLandlord,
}: ModalContentProps): React.JSX.Element {
  return (
    <div className="overflow-y-auto max-h-100 px-4">
      <div className="space-y-3">
        {applications.map((application) => (
          <TenantApplicationCard
            key={application.id}
            application={application}
            onReject={onReject}
            onProgress={onProgress}
            onBackgroundPass={onBackgroundPass}
            onBackgroundFail={onBackgroundFail}
            onSendToLandlord={onSendToLandlord}
          />
        ))}
      </div>
    </div>
  );
}
