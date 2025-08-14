import { TenantApplication } from './TenantApplication';

export type ReviewTenantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onReject: (applicationId: string) => void;
  onAccept: (applicationId: string) => void;
  // onBackgroundPass: (applicationId: string) => void;
  // onBackgroundFail: (applicationId: string) => void;
  onSendToLandlord: () => void;
  // Business logic props - moved from UI component
  shouldShowSendToLandlordButton: boolean;
  acceptedCount: number;
  // propertyAddress?: string;
  // propertyLandlordId?: string;
  // propertyId?: string;
  tenantApplications?: TenantApplication[];
}
