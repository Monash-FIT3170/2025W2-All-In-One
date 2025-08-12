import React from 'react';
import { TenantApplication } from '../types/TenantApplication';
import { TenantApplicationStatus } from '../enums/TenantApplicationStatus';
import { BackgroundCheckStatus } from '../enums/BackgroundCheckStatus';
import { StatusBadge, BackgroundBadge } from './StatusBadges';
import { RejectButton, ProgressButton, BackgroundPassButton, BackgroundFailButton, SendToLandlordButton } from '../../property-listing-page/components/TenantReviewButtons';

type TenantApplicationCardProps = {
  application: TenantApplication;
  onReject: (applicationId: string) => void;
  onProgress: (applicationId: string) => void;
  // onBackgroundPass: (applicationId: string) => void;
  // onBackgroundFail: (applicationId: string) => void;
  onSendToLandlord: (applicationId: string) => void;
}

export function TenantApplicationCard({
  application,
  onReject,
  onProgress,
  // onBackgroundPass,
  // onBackgroundFail,
  onSendToLandlord,
}: TenantApplicationCardProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-gray-900">{application.name}</span>
          <StatusBadge status={application.status} />
        </div>

        {/* Background check badge if exists
        {application.backgroundCheck && (
          <div className="mb-2">
            <BackgroundBadge backgroundCheck={application.backgroundCheck} />
          </div>
        )} */}

        {/* Action buttons based on status */}
        <div className="flex gap-2">
          {application.status === TenantApplicationStatus.UNDETERMINED && (
            <>
              <RejectButton onClick={() => onReject(application.id)} />
              <ProgressButton onClick={() => onProgress(application.id)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
