import { TenantApplicationStatus } from "/app/shared/api-models/tenant/TenantApplicationStatus";

export type TenantApplication = {
  id: string;
  propertyId: string;
  applicantName: string;
  status: TenantApplicationStatus;
  step: number;
  createdAt: Date;
  updatedAt: Date;
  agentId: string;
  landlordId: string;
  taskId?: string;
};

export type TenantApplicationInsertData = {
  propertyId: string;
  applicantName: string;
  agentId: string;
  landlordId: string;
};
