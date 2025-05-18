import { Mongo } from "meteor/mongo";
import { UserAccountDocument } from "./models/UserAccountDocument";
import { AgentDocument } from "./models/role-models/AgentDocument";
import { TenantDocument } from "./models/role-models/TenantDocument";
import { LandlordDocument } from "./models/role-models/LandlordDocument";

export const UserAccountCollection: Mongo.Collection<UserAccountDocument> =
  new Mongo.Collection("user_accounts");
export const AgentCollection: Mongo.Collection<AgentDocument> =
  new Mongo.Collection("agents");
export const TenantCollection: Mongo.Collection<TenantDocument> =
  new Mongo.Collection("tenants");
export const LandlordCollection: Mongo.Collection<LandlordDocument> =
  new Mongo.Collection("landlords");
