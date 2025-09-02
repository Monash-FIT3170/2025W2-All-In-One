export type TenantApplicationDocument = {
    _id: string;
    propertyId: string;
    applicantName: string;
    status: string;
    step: number; // 1 to 4 to track workflow step
    createdAt: Date;
    updatedAt: Date;
    agentId: string;
    landlordId: string;
    tenantUserId: string;
    taskId?: string; // ID of the task created for this application
    linkedTaskId?: string; // ID of the linked task for this application
};