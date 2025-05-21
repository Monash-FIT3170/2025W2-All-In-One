import { ProfileDataDocument } from "../../database/user/models/role-models/ProfileDataDocument";
import { ProfileCollection } from "../../database/user/user-collections";
import { InvalidDataError } from "../../errors/InvalidDataError";
import { meteorWrappedInvalidDataError } from "../../utils/error-utils";
import { ApiProfileData } from "/app/shared/api-models/user/api-roles/ApiProfileData";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

// client method
const getProfileDataMethod = {
    [MeteorMethodIdentifier.PROFILE_GET]: async (
        userId: string
    ): Promise<ApiProfileData> => {
        // TODO : implement
        const profileDataDocument = await getProfileDataDocumentById(userId);

        if (!profileDataDocument) {
            throw meteorWrappedInvalidDataError(
                new InvalidDataError(
                    `Data for user with ID ${userId} not found.`
                )
            );
        }

        try {
            const profileDataDTO = await mapProfileDataDocumentToDTO(
                profileDataDocument
            );
            return profileDataDTO;
        } catch (error: any) {
            throw meteorWrappedInvalidDataError(
                error instanceof Error ? error : new Error("Unknown error")
            );
        }
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

// Data access from backend
async function getProfileDataDocumentById(
    id: string
): Promise<ProfileDataDocument | undefined> {
    return await ProfileCollection.findOneAsync({ _id: id });
}

export async function updateProfileDocumentById(
    id: string,
    updatedData: Partial<ApiProfileData>
): Promise<ProfileDataDocument | undefined> {
    const updateCount = await ProfileCollection.updateAsync(
      { _id: id },
      { $set: updatedData },
    );
    if (updateCount > 0)
      return await ProfileCollection.findOneAsync({_id: id}) 
}

async function mapProfileDataDocumentToDTO(
    profile: ProfileDataDocument
): Promise<ApiProfileData> {
    return {
        userAccountId: profile._id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        dob: profile.dob,
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
