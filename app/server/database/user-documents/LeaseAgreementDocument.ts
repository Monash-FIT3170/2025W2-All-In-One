export type LeaseAgreementDocument = {
	_id: string; // Unique identifier
	propertyId: string; // ID of the property
	title: string; // Title of the lease agreement
	agentId: string; // ID of the agent managing the lease
	uploadedDate: Date; // Date when the document was uploaded
	validUntil: Date; // Expiry date of the lease agreement
	documentUrl: string; // URL to access the document
	tenantName?: string; // Optional tenant name for display purposes
};
