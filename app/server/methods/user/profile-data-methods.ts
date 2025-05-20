import { ProfileDataDocument } from "../../database/user/models/role-models/ProfileDataDocument";
import { ApiProfileData } from "/app/shared/api-models/user/api-roles/ApiProfileData";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

const getProfileDataMethod = {
  [MeteorMethodIdentifier.PROFILE_GET]: async (
    userId: string
  ): Promise<ApiProfileData> => {
    // TODO : implement
    return undefined;
  },
};

const updateProfileDataMethod = {
  [MeteorMethodIdentifier.PROFILE_EDIT]: async (
    userId: string
  ): Promise<ApiProfileData> => {
    // TODO : implement
    return undefined;
  },
};

function mapProfileDataDocumentToDTO(
  profile: ProfileDataDocument
): Promise<ApiProfileData> {
  return {
    userAccountId: profile._id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    dob: profile.email,
    occupation: profile.occupation,
    phone: profile.phone,
    emergencyContact: profile.emergencyContact,
    employer: profile.employer,
    workAddress: profile.workAddress,
    workPhone: profile.workPhone,
    profilePicture: profile.profilePicture,
    carMake: profile.carMake,
    carModel: profile.carModel,
    carYear: profile.carYear,
    carPlate: profile.carPlate,
  };
}

Meteor.methods({ ...updateProfileDataMethod, ...getProfileDataMethod });
