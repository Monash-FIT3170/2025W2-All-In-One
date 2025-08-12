export type ApiTenantApplication = {
  id: string;
  propertyId: string;
  applicantName: string;
  status: string;
  step: number;
  createdAt: Date;
  updatedAt: Date;
  agentId: string;
  landlordId: string;
  taskId?: string;
};
