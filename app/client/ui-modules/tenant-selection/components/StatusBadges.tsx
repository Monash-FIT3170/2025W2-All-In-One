import React from 'react';
import { TenantApplicationStatus } from '/app/shared/api-models/tenant/TenantApplicationStatus';

type StatusBadgeProps = {
  status: TenantApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps): React.JSX.Element | null {
  switch (status) {
    case TenantApplicationStatus.UNDETERMINED:
      return (
        <span className="px-2 py-1 bg-gray-300 text-gray-700 text-xs font-medium rounded">
          UNDETERMINED
        </span>
      );
    case TenantApplicationStatus.REJECTED:
      return (
        <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded">
          REJECTED
        </span>
      );
    case TenantApplicationStatus.ACCEPTED:
      return (
        <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-medium rounded">
          ACCEPTED
        </span>
      );
    case TenantApplicationStatus.LANDLORD_REVIEW:
      return (
        <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-medium rounded">
          LANDLORD REVIEW
        </span>
      );
    case TenantApplicationStatus.LANDLORD_APPROVED:
      return (
        <span className="px-2 py-1 bg-green-300 text-green-800 text-xs font-medium rounded">
          LANDLORD APPROVED
        </span>
      );
    case TenantApplicationStatus.LANDLORD_REJECTED:
      return (
        <span className="px-2 py-1 bg-red-300 text-red-800 text-xs font-medium rounded">
          LANDLORD REJECTED
        </span>
      );
    default:
      return null;
  }
}


