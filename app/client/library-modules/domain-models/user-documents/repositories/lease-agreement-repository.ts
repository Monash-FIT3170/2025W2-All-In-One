import {
	apiGetLeaseAgreement,
	apiGetLeaseAgreementsForAgent,
	apiGetLeaseAgreementsForProperty,
} from "../../../apis/user-documents/lease-agreement-api";
import { LeaseAgreementDocument } from "../LeaseAgreement";
import { mapApiLeaseAgreementToLeaseAgreement } from "./mappers/lease-agreement-mapper";

export async function getLeaseAgreementbyId(
	id: string
): Promise<LeaseAgreementDocument> {
	const apiLease = await apiGetLeaseAgreement(id);
	const mappedLeaseAgreement = mapApiLeaseAgreementToLeaseAgreement(apiLease);

	return mappedLeaseAgreement;
}

export async function getLeaseAgreementsForProperty(
	propertyId: string
): Promise<LeaseAgreementDocument[]> {
	const apiLeases = await apiGetLeaseAgreementsForProperty(propertyId);
	const mappedLeaseAgreements = apiLeases.map((apiLease) =>
		mapApiLeaseAgreementToLeaseAgreement(apiLease)
	);

	return mappedLeaseAgreements;
}

export async function getLeaseAgreementsForAgent(
	agentId: string
): Promise<LeaseAgreementDocument[]> {
	const apiLeases = await apiGetLeaseAgreementsForAgent(agentId);
	const mappedLeaseAgreements = apiLeases.map((apiLease) =>
		mapApiLeaseAgreementToLeaseAgreement(apiLease)
	);

	return mappedLeaseAgreements;
}
