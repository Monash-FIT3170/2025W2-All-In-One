export type ApiLeaseAgreement = {
	_id: string; // Unique identifier
	propertyId: string; // ID of the property
	agentId: string; // ID of the agent managing the lease
	uploadedDate: Date; // Date when the document was uploaded
	validUntil: Date;
	documentUrl: string; // URL to access the document
};

export type InsertLeaseAgreementPayload = {
	propertyId: string; // ID of the property
	agentId: string; // ID of the agent managing the lease
	documentUrl: string; // URL to access the document
	validUntil: Date; // Expiry date of the lease agreement
};
