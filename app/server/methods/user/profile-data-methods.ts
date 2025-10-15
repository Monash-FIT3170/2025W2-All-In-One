import { ProfileDataDocument } from "../../database/user/models/role-models/ProfileDataDocument";
import { ProfileCollection } from "../../database/user/user-collections";
import { InvalidDataError } from "../../errors/InvalidDataError";
import { meteorWrappedInvalidDataError } from "../../utils/error-utils";
import { ApiProfileData } from "/app/shared/api-models/user/api-roles/ApiProfileData";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { Meteor } from "meteor/meteor";

const profileDataInsertMethod = {
    [MeteorMethodIdentifier.PROFILE_INSERT]: async (
        data: Omit<ProfileDataDocument, "_id"> // omitting id
    ): Promise<string> => {
        const newProfile: Mongo.OptionalId<ProfileDataDocument> = {
            ...data,
        };

        return await ProfileCollection.insertAsync(newProfile);
    },
};

// client method
const getProfileDataMethod = {
    [MeteorMethodIdentifier.PROFILE_GET]: async (
        profileId: string
    ): Promise<ApiProfileData> => {
        // TODO : implement
        const profileDataDocument = await getProfileDataDocumentById(profileId);

        if (!profileDataDocument) {
            throw meteorWrappedInvalidDataError(
                new InvalidDataError(
                    `Data for user with ID ${profileId} not found.`
                )
            );
        }

        try {
            const profileDataDTO = await mapProfileDataDocumentToDTO(
                profileDataDocument,
                profileId
            );
            return profileDataDTO;
        } catch (error: unknown) {
            throw meteorWrappedInvalidDataError(
                error instanceof Error ? error : new Error("Unknown error")
            );
        }
    },
};

const updateProfileDataMethod = {
    [MeteorMethodIdentifier.PROFILE_EDIT]: async (
        profileId: string,
        updatedProfileData: Partial<ApiProfileData>
    ): Promise<ApiProfileData> => {
        //Validating input
        if (!profileId || !updatedProfileData) {
            throw meteorWrappedInvalidDataError(
                new InvalidDataError(
                    "User ID as well as updated data are required to edit the data"
                )
            );
        }
        try {
            // Update the profile in the db
            const updatedDocument = await updateProfileDocumentById(
                profileId,
                updatedProfileData
            );
            if (!updatedDocument) {
                throw meteorWrappedInvalidDataError(
                    new InvalidDataError(
                        `Profile for user ${profileId} not found or update failed.`
                    )
                );
            }
            //Convert and return DTO
            return await mapProfileDataDocumentToDTO(
                updatedDocument,
                profileId
            );
        } catch (error: unknown) {
            throw meteorWrappedInvalidDataError(
                error instanceof Error
                    ? error
                    : new Error("Profile update failed.")
            );
        }
    },
};

// Data access from backend
async function getProfileDataDocumentById(
    profileId: string
): Promise<ProfileDataDocument | undefined> {
    return await ProfileCollection.findOneAsync({ _id: profileId });
}

export async function updateProfileDocumentById(
    profileId: string,
    updatedData: Partial<ApiProfileData>
): Promise<ProfileDataDocument | undefined> {
    const updateCount = await ProfileCollection.updateAsync(
        { _id: profileId },
        { $set: updatedData }
    );
    if (updateCount > 0)
        return await ProfileCollection.findOneAsync({ _id: profileId });
}

async function mapProfileDataDocumentToDTO(
    profile: ProfileDataDocument,
    profileId: string
): Promise<ApiProfileData> {
    return {
        profileDataId: profileId,
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
    };
}

Meteor.methods({
    ...updateProfileDataMethod,
    ...getProfileDataMethod,
    ...profileDataInsertMethod,
    [MeteorMethodIdentifier.ACCOUNT_EMAIL_UPDATE]: async function (
        userId: string,
        newEmail: string
    ) {
        if (!userId || !newEmail)
            throw new Meteor.Error("invalid-arguments", "User ID and new email required");
        // Only allow user to update their own email or admin
        if (this.userId !== userId && !Meteor.user()?.isAdmin) {
            throw new Meteor.Error("not-authorized", "Not authorized to update email");
        }
        // Update the email in Meteor accounts
        await Meteor.users.updateAsync(
            { _id: userId },
            { $set: { "emails.0.address": newEmail } }
        );
    },
});
