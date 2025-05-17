import { Mongo } from "meteor/mongo";
import { UserAccountDocument } from "./models/UserAccountDocument";

export const UserAccountCollection: Mongo.Collection<UserAccountDocument> =
  new Mongo.Collection("user_accounts");