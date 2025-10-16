import {
	apiGetLeaseAgreement,
	apiGetLeaseAgreementsForAgent,
	apiGetLeaseAgreementsForProperty,
	apiInsertLeaseAgreement,
	apiDeleteLeaseAgreement,
	apiSearchDocument,
} from "../../../apis/user-documents/lease-agreement-api";
import { LeaseAgreementDocument } from "../LeaseAgreement";
import { mapApiLeaseAgreementToLeaseAgreement } from "./mappers/lease-agreement-mapper";
import { InsertLeaseAgreementPayload } from "/app/shared/api-models/user-documents/ApiLeaseAgreement";

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

export async function insertLeaseAgreement(
	leaseAgreement: InsertLeaseAgreementPayload
): Promise<LeaseAgreementDocument> {
	const apiLease = await apiInsertLeaseAgreement(leaseAgreement);
	const mappedLeaseAgreement = mapApiLeaseAgreementToLeaseAgreement(apiLease);

	return mappedLeaseAgreement;
}

export async function deleteLeaseAgreement(
	id: string
): Promise<void> {
	await apiDeleteLeaseAgreement(id);
}


export async function searchLeaseAgreement(
	agentId: string,
	query: string
): Promise<void> {
	await apiSearchDocument(agentId, query);
}