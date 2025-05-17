import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { UserProfileCollection } from "../../database/user/user-collections";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { UserProfileDocument } from "../../database/user/models/UserProfileDocument";
import { ApiUserProfile } from "/app/shared/api-models/user/ApiUserProfile";
import { meteorWrappedInvalidDataError } from "../../utils/error-utils";
import { InvalidDataError } from "../../errors/InvalidDataError";

// -- INSERT USER --
const userInsertMethod = {
  [MeteorMethodIdentifier.USER_INSERT]: async (
    // omitting id since we dont want the db to generate one but Accounts library already creates one to link to auth stuff
    data: Omit<UserProfileDocument, "_id" | "createdAt">
  ): Promise<string> => {
    const newUserProfile: Mongo.OptionalId<UserProfileDocument> = {
      ...data,
      createdAt: new Date(),
    };

    return await UserProfileCollection.insertAsync(newUserProfile);
  },
};

// -- GET USER BY ID FUNCTION --
const userGetMethod = {
  [MeteorMethodIdentifier.USER_GET]: async (
    userId: string
  ): Promise<ApiUserProfile> => {
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
  user: UserProfileDocument
): Promise<ApiUserProfile> {
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
): Promise<UserProfileDocument | undefined> {
  return await UserProfileCollection.findOneAsync({ _id: id });
}

Meteor.methods({
  ...userInsertMethod,
  ...userGetMethod,
});
