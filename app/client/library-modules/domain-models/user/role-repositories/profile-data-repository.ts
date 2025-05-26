import {
  apiGetProfileData,
  apiUpdateProfileData,
} from "../../../apis/user/user-role-api";
import { ProfileData } from "../ProfileData";
import {
  mapApiProfileDataToProfileData,
  mapProfileDataToApiProfileData,
} from "./mappers/profile-data-mapper";

export async function getProfileDataById(id: string): Promise<ProfileData> {
  const apiProfileID = await apiGetProfileData(id);
  const mappedProfile = mapApiProfileDataToProfileData(apiProfileID);

  return mappedProfile;
}

export async function setProfileDataById(
  id: string,
  updatedProfile: ProfileData
): Promise<ProfileData> {
  const apiPayload = await mapProfileDataToApiProfileData(updatedProfile);
  const updatedData = await apiUpdateProfileData(id, apiPayload);

  return mapApiProfileDataToProfileData(updatedData);
}
