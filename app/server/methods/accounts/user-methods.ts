import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { UserProfileCollection } from "../../database/user/user-collections";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { UserProfileDocument } from "../../database/user/models/UserProfileDocument";


const userInsertMethod = {
  [MeteorMethodIdentifier.USER_INSERT]: async (
    data: Omit<UserProfileDocument, "_id" | "createdAt">
  ): Promise<string> => {
    const newUserProfile: Mongo.OptionalId<UserProfileDocument> = {
      ...data,
      createdAt: new Date()
    };

    return await UserProfileCollection.insertAsync(newUserProfile);
  }
};


Meteor.methods({
  ...userInsertMethod
});
