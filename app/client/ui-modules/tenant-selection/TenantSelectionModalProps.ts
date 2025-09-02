import { TenantApplication } from "/app/client/library-modules/domain-models/tenant-application/TenantApplication";
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
  backgroundPassedApplicantCount: number;
  hasAcceptedApplications: boolean;
};

export type LandlordTenantSelectionModalProps = BaseTenantSelectionModalProps & {
  role: Role.LANDLORD;
  onSendToAgent: () => void;
  onSendFinalApprovedToAgent: () => void;
  shouldShowSendToAgentButton: boolean;
  shouldShowSendFinalApprovedToAgentButton: boolean;
  landlordApprovedApplicantCount: number;
  finalApprovedApplicantCount: number
};

export type TenantSelectionModalProps =
  | AgentTenantSelectionModalProps
  | LandlordTenantSelectionModalProps;


