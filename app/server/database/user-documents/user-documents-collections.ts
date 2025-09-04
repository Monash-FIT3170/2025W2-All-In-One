import { LeaseAgreementDocument } from "./LeaseAgreementDocument";

export const LeaseAgreementCollection: Mongo.Collection<LeaseAgreementDocument> =
	new Mongo.Collection("lease_agreements");
