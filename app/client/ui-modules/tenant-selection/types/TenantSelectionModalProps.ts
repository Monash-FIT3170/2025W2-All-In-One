import { TenantApplication } from './TenantApplication';
import { Role } from '/app/shared/user-role-identifier';

type BaseTenantSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tenantApplications?: TenantApplication[];
  onReject: (applicationId: string) => void;
  onAccept: (applicationId: string) => void;
};

export type AgentTenantSelectionModalProps = BaseTenantSelectionModalProps & {
  role: Role.AGENT;
  onSendToLandlord: () => void;
  shouldShowSendToLandlordButton: boolean;
  acceptedApplicantCount: number;
};

export type LandlordTenantSelectionModalProps = BaseTenantSelectionModalProps & {
  role: Role.LANDLORD;
  onSendToAgent: () => void;
  shouldShowSendToAgentButton: boolean;
  landlordApprovedApplicantCount: number;
};

export type TenantSelectionModalProps =
  | AgentTenantSelectionModalProps
  | LandlordTenantSelectionModalProps;



// export type TenantSelectionModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   onReject: (applicationId: string) => void;
//   onAccept: (applicationId: string) => void;
//   onSendToLandlord: () => void;
//   onSendToAgent: () => void;
//   shouldShowSendToLandlordButton: boolean;
//   shouldShowSendToAgentButton: boolean;
//   acceptedApplicantCount: number; // ✅ Add this
//   landlordApprovedApplicantCount: number;
//   userRole?: UserAccount["role"];
//   tenantApplications?: TenantApplication[];
// }