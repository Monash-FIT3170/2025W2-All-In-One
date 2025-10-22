import { Mongo } from 'meteor/mongo';
import { TenantApplicationDocument } from '../models/TenantApplicationDocument';

export const TenantApplicationCollection = new Mongo.Collection<TenantApplicationDocument>('tenantApplications');
