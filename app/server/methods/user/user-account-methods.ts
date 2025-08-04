import { Meteor } from "meteor/meteor";
import { UserAccountCollection } from "../../database/user/user-collections";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { UserAccountDocument } from "../../database/user/models/UserAccountDocument";
import { ApiUserAccount } from "../../../shared/api-models/user/ApiUserAccount";
import { meteorWrappedInvalidDataError } from "../../utils/error-utils";
import { InvalidDataError } from "../../errors/InvalidDataError";

// -- INSERT USER --
const userInsertMethod = {
    [MeteorMethodIdentifier.USER_ACCOUNT_INSERT]: async (
        data: UserAccountDocument
    ): Promise<string> => {
        const newUserAccount: UserAccountDocument = {
            ...data,
        };

        return await UserAccountCollection.insertAsync(newUserAccount);
    },
};

// -- GET USER BY ID FUNCTION --
const userGetMethod = {
    [MeteorMethodIdentifier.USER_ACCOUNT_GET]: async (
        userId: string
    ): Promise<ApiUserAccount> => {
        const userDocument = await getUserDocumentById(userId);

        if (!userDocument) {
            throw meteorWrappedInvalidDataError(
                new InvalidDataError(`User with ID ${userId} not found.`)
            );
        }

        try {
            const userDTO = await mapUserDocumentToDTO(userDocument);
            return userDTO;
        } catch (error) {
            throw meteorWrappedInvalidDataError(
                error instanceof Error ? error : new Error("Unknown error")
            );
        }
    },
};

// -- MAPPING FUNCTION --
async function mapUserDocumentToDTO(
    user: UserAccountDocument
): Promise<ApiUserAccount> {
    return {
        userId: user._id,
        role: user.role,
    };
}

// -- DATA ACCESS FUNCTION --
async function getUserDocumentById(
    id: string
): Promise<UserAccountDocument | undefined> {
    return await UserAccountCollection.findOneAsync({ _id: id });
}

Meteor.methods({
    ...userInsertMethod,
    ...userGetMethod,
});
