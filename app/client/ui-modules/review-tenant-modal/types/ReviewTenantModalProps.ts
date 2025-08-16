import { TenantApplication } from './TenantApplication';
import { UserAccount } from '/app/client/library-modules/domain-models/user/UserAccount';

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
  userRole?: UserAccount["role"]
  tenantApplications?: TenantApplication[];
}
