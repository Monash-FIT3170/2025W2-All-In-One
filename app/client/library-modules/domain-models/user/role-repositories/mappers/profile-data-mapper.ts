import { ProfileData } from "../../ProfileData";
import { ApiProfileData } from "/app/shared/api-models/user/api-roles/ApiProfileData";

export function mapApiProfileDataToProfileData(
  profileData: ApiProfileData
): ProfileData {
  return {
    profileDataId: profileData.profileDataId,
    userAccountId: profileData.userAccountId,
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    dob: profileData.dob,
    occupation: profileData.occupation,
    phone: profileData.phone,
    emergencyContact: profileData.emergencyContact,
    employer: profileData.employer,
    workAddress: profileData.workAddress,
    workPhone: profileData.workPhone,
    profilePicture: profileData.profilePicture,
  };
}

export function mapProfileDataToApiProfileData(
  profileData: ProfileData
): ApiProfileData {
  return {
    profileDataId: profileData.profileDataId,
    userAccountId: profileData.userAccountId,
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    dob: profileData.dob,
    occupation: profileData.occupation,
    phone: profileData.phone,
    emergencyContact: profileData.emergencyContact,
    employer: profileData.employer,
    workAddress: profileData.workAddress,
    workPhone: profileData.workPhone,
    profilePicture: profileData.profilePicture,
  };
}
