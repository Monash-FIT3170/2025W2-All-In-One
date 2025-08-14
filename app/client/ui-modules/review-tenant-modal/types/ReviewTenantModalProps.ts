import { TenantApplication } from './TenantApplication';

export type ReviewTenantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onReject: (applicationId: string) => void;
  onAccept: (applicationId: string) => void;
  // onBackgroundPass: (applicationId: string) => void;
  // onBackgroundFail: (applicationId: string) => void;
  onSendToLandlord: () => void;
  shouldShowSendToLandlordButton: boolean;
  acceptedCount: number;
  tenantApplications?: TenantApplication[];
}
