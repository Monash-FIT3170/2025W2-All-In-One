import React from 'react';
import { TenantApplication } from "/app/client/library-modules/domain-models/tenant-application/TenantApplication";
import { TenantApplicationStatus } from '../../../../shared/api-models/tenant-application/TenantApplicationStatus';
import { StatusBadge } from './StatusBadges';
import { RejectButton, AcceptButton, BackgroundFailButton, BackgroundPassButton } from '../../property-listing-page/components/TenantReviewButtons';
import { UserAccount } from '/app/client/library-modules/domain-models/user/UserAccount';
import { Role } from '/app/shared/user-role-identifier';
import { canResetApplication } from '/app/client/library-modules/utils/tenant-application-utils';

type TenantApplicationCardProps = {
  application: TenantApplication;
  onReject: (applicationId: string) => void;
  onAccept: (applicationId: string) => void;
  userRole?: UserAccount["role"];
  onReset?: (applicationId: string, currentStatus: TenantApplicationStatus) => void;
}

export const TenantApplicationCard = ({
  application,
  onReject,
  onAccept,
  onReset,
  userRole,
}: TenantApplicationCardProps): React.JSX.Element => {
  const handleReject = () => {
    onReject(application.id);
  };

  const handleAccept = () => {
    onAccept(application.id);
  };

  const handleReset = () => {
    onReset?.(application.id, application.status);
  };

  const canAgentReview = userRole === Role.AGENT &&
    application.status === TenantApplicationStatus.UNDETERMINED;

  const canLandlordReview = userRole === Role.LANDLORD &&
    application.status === TenantApplicationStatus.LANDLORD_REVIEW;

  const canAgentBackgroundCheck = userRole === Role.AGENT &&
    application.status === TenantApplicationStatus.BACKGROUND_CHECK_PENDING;

  const canLandlordFinalReview = userRole === Role.LANDLORD &&
    application.status === TenantApplicationStatus.FINAL_REVIEW;

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-gray-900">{application.applicantName}</span>
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

          {/* Landlord final review actions */}
          {canLandlordFinalReview && (
            <>
            <RejectButton onClick={handleReject} />
            <AcceptButton onClick={handleAccept} />
          </>
          )}

          {/* Reset decision button */}
          {userRole && canResetApplication(userRole, application.status) && (
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Reset
          </button>
        )}
        </div>
      </div>
    </div>
  );
}
