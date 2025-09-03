import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { LeaseAgreementCollection } from "/app/server/database/user-documents/user-documents-collections";
import { LeaseAgreementDocument } from "/app/server/database/user-documents/LeaseAgreementDocument";
import { InvalidDataError } from "/app/server/errors/InvalidDataError";
import { meteorWrappedInvalidDataError } from "/app/server/utils/error-utils";
import { ApiLeaseAgreement } from "/app/shared/api-models/user-documents/ApiLeaseAgreement";

// Insert (returns DTO, not just id)
const leaseAgreementInsertMethod = {
	[MeteorMethodIdentifier.LEASE_AGREEMENT_INSERT]: async (
		data: Omit<LeaseAgreementDocument, "_id" | "uploadedDate">
	): Promise<ApiLeaseAgreement> => {
		// Align checks with message
		if (!data.propertyId || !data.agentId) {
			throw meteorWrappedInvalidDataError(
				new InvalidDataError("propertyId and agentId are required")
			);
		}
		if (!data.documentUrl || data.documentUrl.trim() === "") {
			throw meteorWrappedInvalidDataError(
				new InvalidDataError("documentUrl is required")
			);
		}

		const toInsert: Omit<LeaseAgreementDocument, "_id"> = {
			...data,
			uploadedDate: new Date(),
		};

		try {
			const _id = await LeaseAgreementCollection.insertAsync(toInsert);
			const inserted = await LeaseAgreementCollection.findOneAsync({ _id });
			if (!inserted) throw new Error("Insert succeeded but document not found");
			return mapLeaseAgreementDocumentToDTO(inserted);
		} catch (error) {
			throw meteorWrappedInvalidDataError(
				new InvalidDataError(
					`Failed to insert lease agreement: ${String(error)}`
				)
			);
		}
	},
};

const getLeaseAgreementDocumentById = async (id: string) =>
	LeaseAgreementCollection.findOneAsync({ _id: id });

const getLeaseAgreementDocumentsByProperty = async (propertyId: string) =>
	LeaseAgreementCollection.find(
		{ propertyId },
		{ sort: { uploadedDate: -1 } }
	).fetchAsync();

const getLeaseAgreementDocumentsByAgent = async (agentId: string) =>
	LeaseAgreementCollection.find(
		{ agentId },
		{ sort: { uploadedDate: -1 } }
	).fetchAsync();

// Getter
const leaseAgreementGetMethod = {
	[MeteorMethodIdentifier.LEASE_AGREEMENT_GET]: async (
		id: string
	): Promise<ApiLeaseAgreement> => {
		check(id, String);
		const doc = await getLeaseAgreementDocumentById(id);
		if (!doc) {
			throw meteorWrappedInvalidDataError(
				new InvalidDataError(`Lease agreement with id ${id} not found`)
			);
		}
		return mapLeaseAgreementDocumentToDTO(doc);
	},
};

// Will get the lease agreement(s) for a property
const leaseAgreementsForPropertyMethod = {
	[MeteorMethodIdentifier.LEASE_AGREEMENT_LIST_FOR_PROPERTY]: async (
		propertyId: string
	): Promise<ApiLeaseAgreement[]> => {
		check(propertyId, String);
		const docs = await getLeaseAgreementDocumentsByProperty(propertyId);
		return docs.map(mapLeaseAgreementDocumentToDTO);
	},
};

// Will get the lease agreement(s) for an agent
const leaseAgreementsForAgentMethod = {
	[MeteorMethodIdentifier.LEASE_AGREEMENT_LIST_FOR_AGENT]: async (
		agentId: string
	): Promise<ApiLeaseAgreement[]> => {
		check(agentId, String);
		// TODO: authz – ensure this.userId === agentId or caller has permission
		const docs = await getLeaseAgreementDocumentsByAgent(agentId);
		return docs.map(mapLeaseAgreementDocumentToDTO);
	},
};

// Delete
const leaseAgreementDeleteMethod = {
	[MeteorMethodIdentifier.LEASE_AGREEMENT_DELETE]: async (
		id: string
	): Promise<number> => {
		check(id, String);
		try {
			const removedCount = await LeaseAgreementCollection.removeAsync({
				_id: id,
			});
			if (!removedCount) {
				throw new InvalidDataError(`Lease agreement with id ${id} not found`);
			}
			return removedCount;
		} catch (error) {
			throw meteorWrappedInvalidDataError(
				new InvalidDataError(`Failed to delete lease agreement: ${error}`)
			);
		}
	},
};
export const mapLeaseAgreementDocumentToDTO = (
	doc: LeaseAgreementDocument
): ApiLeaseAgreement => ({
	_id: doc._id,
	propertyId: doc.propertyId,
	agentId: doc.agentId,
	uploadedDate: doc.uploadedDate,
	documentUrl: doc.documentUrl,
	validUntil: doc.validUntil,
	tenantName: doc.tenantName,
});

Meteor.methods({
	...leaseAgreementInsertMethod,
	...leaseAgreementGetMethod,
	...leaseAgreementDeleteMethod,
	...leaseAgreementsForPropertyMethod,
	...leaseAgreementsForAgentMethod,
});
