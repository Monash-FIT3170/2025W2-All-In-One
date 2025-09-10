import {
  ApiLeaseAgreement,
  InsertLeaseAgreementPayload,
} from "/app/shared/api-models/user-documents/ApiLeaseAgreement";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

export async function apiGetLeaseAgreement(
  leaseId: string
): Promise<ApiLeaseAgreement> {
  return await Meteor.callAsync(
    MeteorMethodIdentifier.LEASE_AGREEMENT_GET,
    leaseId
  );
}

export async function apiGetLeaseAgreementsForProperty(
  propertyId: string
): Promise<ApiLeaseAgreement[]> {
  return await Meteor.callAsync(
    MeteorMethodIdentifier.LEASE_AGREEMENT_LIST_FOR_PROPERTY,
    propertyId
  );
}

export async function apiGetLeaseAgreementsForAgent(
  agentId: string
): Promise<ApiLeaseAgreement[]> {
  return await Meteor.callAsync(
    MeteorMethodIdentifier.LEASE_AGREEMENT_LIST_FOR_AGENT,
    agentId
  );
}

export async function apiInsertLeaseAgreement(
  leaseAgreement: InsertLeaseAgreementPayload
): Promise<ApiLeaseAgreement> {
  return await Meteor.callAsync(
    MeteorMethodIdentifier.LEASE_AGREEMENT_INSERT,
    leaseAgreement
  );
}

export async function apiDeleteLeaseAgreement(
  leaseId: string
): Promise<ApiLeaseAgreement> {
  return await Meteor.callAsync(
    MeteorMethodIdentifier.LEASE_AGREEMENT_DELETE,
    leaseId
  );
}

export async function apiAgentSignDocument(
  documentId: string
): Promise<ApiLeaseAgreement> {
  return await Meteor.callAsync(
    MeteorMethodIdentifier.AGENT_SIGN_DOCUMENT,
    documentId
  );
}

export async function apiTenantSignDocument(
  documentId: string
): Promise<ApiLeaseAgreement> {
  return await Meteor.callAsync(
    MeteorMethodIdentifier.TENANT_SIGN_DOCUMENT,
    documentId
  );
}

export async function apiLandlordSignDocument(
  documentId: string
): Promise<ApiLeaseAgreement> {
  return await Meteor.callAsync(
    MeteorMethodIdentifier.LANDLORD_SIGN_DOCUMENT,
    documentId
  );
}
