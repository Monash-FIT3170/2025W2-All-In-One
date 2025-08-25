import React from 'react';
import { TenantApplication } from '../types/TenantApplication';
import { TenantApplicationStatus } from '../../../../shared/api-models/tenant-application/TenantApplicationStatus';
import { StatusBadge } from './StatusBadges';
import { RejectButton, AcceptButton, BackgroundFailButton, BackgroundPassButton } from '../../property-listing-page/components/TenantReviewButtons';
import { UserAccount } from '/app/client/library-modules/domain-models/user/UserAccount';
import { Role } from '/app/shared/user-role-identifier';

type TenantApplicationCardProps = {
  application: TenantApplication;
  onReject: (applicationId: string) => void;
  onAccept: (applicationId: string) => void;
  userRole?: UserAccount["role"];
}

export const TenantApplicationCard = ({
  application,
  onReject,
  onAccept,
  userRole,
}: TenantApplicationCardProps): React.JSX.Element => {
  const handleReject = () => {
    onReject(application.id);
  };

  const handleAccept = () => {
    onAccept(application.id);
  };

  const canAgentReview = userRole === Role.AGENT &&
    application.status === TenantApplicationStatus.UNDETERMINED;

  const canLandlordReview = userRole === Role.LANDLORD &&
    application.status === TenantApplicationStatus.LANDLORD_REVIEW;

  const canAgentBackgroundCheck = userRole === Role.AGENT &&
    application.status === TenantApplicationStatus.BACKGROUND_CHECK_PENDING;

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-gray-900">{application.name}</span>
          <StatusBadge status={application.status} />
        </div>



        {/* Action buttons for based on status */}
        <div className="flex gap-2">
          {/* Agent review actions */}
          {canAgentReview && (
            <>
              <RejectButton onClick={handleReject} />
              <AcceptButton onClick={handleAccept} />
            </>
          )}

          {/* Landlord review actions */}
          {canLandlordReview && (
            <>
              <RejectButton onClick={handleReject} />
              <AcceptButton onClick={handleAccept} />
            </>
          )}

          {/* Agent background check actions */}
          {canAgentBackgroundCheck && (
            <>
              <BackgroundFailButton onClick={handleReject} />
              <BackgroundPassButton onClick={handleAccept} />
            </>
          )}

          {/* Status messages for different states
          {userRole === Role.LANDLORD && application.status === TenantApplicationStatus.ACCEPTED && (
            <div className="text-sm text-gray-500">
              Accepted by agent - ready for your review
            </div>
          )}

          {userRole === Role.LANDLORD && application.status === TenantApplicationStatus.LANDLORD_APPROVED && (
            <div className="text-sm text-green-600">
              ✓ Approved by you
            </div>
          )}

          {userRole === Role.LANDLORD && application.status === TenantApplicationStatus.LANDLORD_REJECTED && (
            <div className="text-sm text-red-600">
              ✗ Rejected by you
            </div>
          )}

          {userRole === Role.AGENT && application.status === TenantApplicationStatus.LANDLORD_REVIEW && (
            <div className="text-sm text-blue-600">
              Sent to landlord for review
            </div>
          )}

          {userRole === Role.AGENT && application.status === TenantApplicationStatus.LANDLORD_APPROVED && (
            <div className="text-sm text-green-600">
              ✓ Approved by landlord
            </div>
          )}

          {userRole === Role.AGENT && application.status === TenantApplicationStatus.LANDLORD_REJECTED && (
            <div className="text-sm text-red-600">
              ✗ Rejected by landlord
            </div>
          )} */}

          {application.status == TenantApplicationStatus.BACKGROUND_CHECK_PENDING && (
            <div className ="text-sm text-amber-600">
              Background check pending
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
