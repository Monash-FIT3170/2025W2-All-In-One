import React from 'react';
import { TenantApplication } from '../types/TenantApplication';
import { TenantApplicationStatus } from '../enums/TenantApplicationStatus';
import { BackgroundCheckStatus } from '../enums/BackgroundCheckStatus';
import { StatusBadge, BackgroundBadge } from './StatusBadges';
import { RejectButton, AcceptButton, BackgroundPassButton, BackgroundFailButton, SendToLandlordButton } from '../../property-listing-page/components/TenantReviewButtons';
import { UserAccount } from '/app/client/library-modules/domain-models/user/UserAccount';
import { Role } from '/app/shared/user-role-identifier';

type TenantApplicationCardProps = {
  application: TenantApplication;
  onReject: (applicationId: string) => void;
  onAccept: (applicationId: string) => void;
  userRole: UserAccount["role"]
}

export function TenantApplicationCard({
  application,
  onReject,
  onAccept,
  userRole,
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
              <AcceptButton onClick={() => onAccept(application.id)} />
            </>
          )}

          {/* Landlords can see applications but not modify them */}
          {userRole === Role.LANDLORD && (
            <div className="text-sm text-gray-500">
              {application.status === TenantApplicationStatus.LANDLORD_REVIEW &&
                'Ready for your review'}
              {application.status === TenantApplicationStatus.ACCEPTED &&
                'Accepted by agent'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
