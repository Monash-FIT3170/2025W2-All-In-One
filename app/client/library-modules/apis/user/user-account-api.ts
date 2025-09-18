import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiUserAccount } from "/app/shared/api-models/user/ApiUserAccount";
import { ApiLoginHistoryPage } from "../../../../shared/api-models/user/ApiLoginHistory";

export async function apiGetUserAccount(userId: string): Promise<ApiUserAccount> {
  return await Meteor.callAsync(MeteorMethodIdentifier.USER_ACCOUNT_GET, userId);
}

export async function apiGetProfileByAgentId(agentId: string): Promise<any> {
  return await Meteor.callAsync(MeteorMethodIdentifier.PROFILE_GET_BY_AGENT_ID, agentId);
}

export async function apiGetProfileByTenantId(tenantId: string): Promise<any> {
  return await Meteor.callAsync(MeteorMethodIdentifier.PROFILE_GET_BY_TENANT_ID, tenantId);
}

export async function apiGetProfileByLandlordId(landlordId: string): Promise<any> {
  return await Meteor.callAsync(MeteorMethodIdentifier.PROFILE_GET_BY_LANDLORD_ID, landlordId);
}

export async function apiGetLoginHistory(
  userId: string,
  page: number,
  pageSize: number
): Promise<ApiLoginHistoryPage> {
  return await Meteor.callAsync(
    MeteorMethodIdentifier.LOGIN_HISTORY_GET_FOR_USER,
    { userId, page, pageSize }
  );
}
