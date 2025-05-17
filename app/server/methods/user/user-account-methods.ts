import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { UserAccountCollection } from "../../database/user/user-collections";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { UserAccountDocument } from "../../database/user/models/UserAccountDocument";
import { ApiUserAccount } from "../../../shared/api-models/user/ApiUserAccount";
import { meteorWrappedInvalidDataError } from "../../utils/error-utils";
import { InvalidDataError } from "../../errors/InvalidDataError";

// -- INSERT USER --
const userInsertMethod = {
  [MeteorMethodIdentifier.USER_INSERT]: async (
    data: Omit<UserAccountDocument, "createdAt"> // only omitting created at, and id we want it to be linked to the meteor.users accounts
  ): Promise<string> => {
    const newUserAccount: UserAccountDocument = {
      ...data,
      createdAt: new Date(),
    };

    return await UserAccountCollection.insertAsync(newUserAccount);
  },
};

// -- GET USER BY ID FUNCTION --
const userGetMethod = {
  [MeteorMethodIdentifier.USER_GET]: async (
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
    } catch (error: any) {
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
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    agentCode: user.agentCode,
    createdAt: user.createdAt,
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
