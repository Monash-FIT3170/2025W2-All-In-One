import { TenantApplication } from './TenantApplication';

export type ReviewTenantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onReject: (applicationId: string) => void;
  onProgress: (applicationId: string) => void;
  onBackgroundPass: (applicationId: string) => void;
  onBackgroundFail: (applicationId: string) => void;
  onSendToLandlord: (applicationId: string) => void;
  propertyAddress?: string;
  tenantApplications?: TenantApplication[];
}
