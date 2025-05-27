import React from 'react';
import { TenantApplicationStatus } from '../enums/TenantApplicationStatus';
import { BackgroundCheckStatus } from '../enums/BackgroundCheckStatus';

type StatusBadgeProps = {
  status: TenantApplicationStatus;
}

type BackgroundBadgeProps = {
  backgroundCheck?: BackgroundCheckStatus;
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
    default:
      return null;
  }
}

export function BackgroundBadge({ backgroundCheck }: BackgroundBadgeProps): React.JSX.Element | null {
  switch (backgroundCheck) {
    case BackgroundCheckStatus.PASS:
      return (
        <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
          BACKGROUND PASS
        </span>
      );
    case BackgroundCheckStatus.FAIL:
      return (
        <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
          BACKGROUND FAIL
        </span>
      );
    default:
      return null;
  }
}
