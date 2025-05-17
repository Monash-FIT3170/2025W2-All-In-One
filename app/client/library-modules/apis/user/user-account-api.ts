import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiUserAccount } from "/app/shared/api-models/user/ApiUserAccount";

export async function apiGetUserAccount(userId: string): Promise<ApiUserAccount> {
  return await Meteor.callAsync(MeteorMethodIdentifier.USER_ACCOUNT_GET, userId);
}
