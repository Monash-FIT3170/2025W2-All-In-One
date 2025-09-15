import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiAgent } from "/app/shared/api-models/user/api-roles/ApiAgent";
import { ApiTenant } from "/app/shared/api-models/user/api-roles/ApiTenant";
import { ApiLandlord } from "/app/shared/api-models/user/api-roles/ApiLandlord";
import { ApiProfileData } from "/app/shared/api-models/user/api-roles/ApiProfileData";

export async function apiGetAgent(userId: string): Promise<ApiAgent> {
  return await Meteor.callAsync(MeteorMethodIdentifier.AGENT_GET, userId);
}

export async function apiGetAgentbyId(userId: string): Promise<ApiAgent> {
  return await Meteor.callAsync(MeteorMethodIdentifier.AGENT_GET_BY_AGENT_ID, userId);
}

export async function apiGetTenant(userId: string): Promise<ApiTenant> {
  return await Meteor.callAsync(MeteorMethodIdentifier.TENANT_GET, userId);
}

export async function apiGetLandlord(userId: string): Promise<ApiLandlord> {
  return await Meteor.callAsync(MeteorMethodIdentifier.LANDLORD_GET, userId);
}

export async function apiGetLandlordByLandlordId(landlordId: string): Promise<ApiLandlord> {
  return await Meteor.callAsync(MeteorMethodIdentifier.LANDLORD_GET_BY_LANDLORD_ID, landlordId);
}

export async function apiGetAllLandlords(): Promise<ApiLandlord[]> {
  return await Meteor.callAsync(MeteorMethodIdentifier.LANDLORD_GET_ALL);
}

export async function apiGetProfileData(
  profileId: string
): Promise<ApiProfileData> {
  return await Meteor.callAsync(MeteorMethodIdentifier.PROFILE_GET, profileId);
}

export async function apiUpdateProfileData(
  profileId: string,
  updatedData: Partial<ApiProfileData>
): Promise<ApiProfileData> {
  return await Meteor.callAsync(
    MeteorMethodIdentifier.PROFILE_EDIT,
    profileId,
    updatedData
  );
}
