import React from 'react';
import { CloseIcon } from './CloseIcon';

type ModalHeaderProps = {
  onClose: () => void;
}

export function ModalHeader({ onClose }: ModalHeaderProps): React.JSX.Element {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Review Potential Tenant List</h2>
        <p className="text-sm text-gray-600">Reject/Approve Tenants and add background check status</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close modal"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
