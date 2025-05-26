import React from 'react';
import { DoneButton } from '../../property-listing-page/components/TenantReviewButtons';

type ModalDoneProps = {
  onClose: () => void;
}

export function ModalDone({ onClose }: ModalDoneProps): React.JSX.Element {
  return (
    <div className="p-4 border-t">
      <div className="flex justify-end">
        <DoneButton onClick={onClose} />
      </div>
    </div>
  );
}
