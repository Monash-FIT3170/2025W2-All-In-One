export type ApiLeaseAgreement = {
	_id: string; // Unique identifier
	propertyId: string; // ID of the property
	title: string; // Title of the lease agreement
	agentId: string; // ID of the agent managing the lease
	uploadedDate: Date; // Date when the document was uploaded
	validUntil: Date;
	documentUrl: string; // URL to access the document
	tenantName?: string; // Optional tenant name for display purposes
	tenantSigned?: boolean; // Indicates if the tenant has signed the agreement
	landlordSigned?: boolean; // Indicates if the landlord has signed the agreement
	agentSigned?: boolean; // Indicates if the agent has signed the agreement
};

export type InsertLeaseAgreementPayload = {
	propertyId: string; // ID of the property
	title: string; // Title of the lease agreement
	agentId: string; // ID of the agent managing the lease
	documentUrl: string; // URL to access the document
	validUntil: Date; // Expiry date of the lease agreement
};
