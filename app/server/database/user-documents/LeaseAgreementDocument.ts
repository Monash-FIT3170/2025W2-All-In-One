export type LeaseAgreementDocument = {
	_id: string; // Unique identifier
	propertyId: string; // ID of the property
	title: string; // Title of the lease agreement
	agentId: string; // ID of the agent managing the lease
	uploadedDate: Date; // Date when the document was uploaded
	validUntil: Date; // Expiry date of the lease agreement
	documentUrl: string; // URL to access the document
	tenantId?: string; // Optional tenant name for display purposes
	tenantSigned?: boolean; // Indicates if the tenant has signed the agreement
	landlordSigned?: boolean; // Indicates if the landlord has signed the agreement
	agentSigned?: boolean; // Indicates if the agent has signed the agreement
};
