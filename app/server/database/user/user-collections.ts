import { Mongo } from "meteor/mongo";
import { UserProfileDocument } from "./models/UserProfileDocument";

export const UserProfileCollection: Mongo.Collection<UserProfileDocument> =
  new Mongo.Collection("user_profiles");