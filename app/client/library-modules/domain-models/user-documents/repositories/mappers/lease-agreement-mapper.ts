import { LeaseAgreementDocument } from "../../LeaseAgreement";

import { ApiLeaseAgreement } from "/app/shared/api-models/user-documents/ApiLeaseAgreement";

export function mapApiLeaseAgreementToLeaseAgreement(
	leaseAgreement: ApiLeaseAgreement
): LeaseAgreementDocument {
	return {
		_id: leaseAgreement._id,
		title: leaseAgreement.title,
		propertyId: leaseAgreement.propertyId,
		agentId: leaseAgreement.agentId,
		uploadedDate: new Date(leaseAgreement.uploadedDate),
		validUntil: new Date(leaseAgreement.validUntil),
		documentUrl: leaseAgreement.documentUrl,
		tenantId: leaseAgreement.tenantId,
		tenantSigned: leaseAgreement.tenantSigned,
		landlordSigned: leaseAgreement.landlordSigned,
		agentSigned: leaseAgreement.agentSigned,
	};
}
