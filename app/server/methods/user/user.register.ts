import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Accounts } from "meteor/accounts-base";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { Role } from "../../../shared/user-role-identifier";

type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  accountType: Role;
  agentCode?: string;
};

function validateRegisterPayload(data: RegisterPayload) {
  check(data, {
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    accountType: Match.OneOf(...Object.values(Role)),
    agentCode: Match.Maybe(String),
  });

  if (data.password.length < 8) {
    throw new Meteor.Error(
      "weak-password",
      "Password must be at least 8 characters long."
    );
  }

  if (data.accountType === Role.AGENT) {
    if (!data.agentCode?.trim()) {
      throw new Meteor.Error("missing-code", "Agent verification code is required.");
    }
    //TODO: ADD CORRECT AGENT CODE VERIFICATION FOR FUTURE!!
    if (data.agentCode !== "AGENT123") {
      throw new Meteor.Error(
        "invalid-code",
        "Invalid agent verification code."
      );
    }
  }
}

async function registerUser(data: RegisterPayload): Promise<{ userId: string }> {
  try {
    // 1. Create Meteor user (auth)
    const userId = await Accounts.createUserAsync({
      email: data.email,
      password: data.password,
    });

    // 2. Create UserAccount record
    await Meteor.callAsync(MeteorMethodIdentifier.USER_INSERT, {
      _id: userId,
      role: data.accountType,
    });

    // 3. Create role-specific record
    const common = {
      userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      createdAt: new Date(),
    };

    switch (data.accountType) {
      case Role.AGENT:
        await Meteor.callAsync(MeteorMethodIdentifier.AGENT_INSERT, {
          ...common,
          agentCode: data.agentCode || "",
        });
        break;
      case Role.TENANT:
        await Meteor.callAsync(MeteorMethodIdentifier.TENANT_INSERT, common);
        break;
      case Role.LANDLORD:
        await Meteor.callAsync(MeteorMethodIdentifier.LANDLORD_INSERT, common);
        break;
    }

    return { userId };
  } catch (e: any) {
    if (
      e instanceof Meteor.Error &&
      e.message?.includes("Something went wrong. Please check your credentials.")
    ) {
      throw new Meteor.Error(403, "An account with this email already exists.");
    }

    throw new Meteor.Error("registration-failed", "Something went wrong during registration.");
  }
}

export const userRegisterMethod = {
  [MeteorMethodIdentifier.USER_REGISTER]: async (data: RegisterPayload) => {
    validateRegisterPayload(data);
    return await registerUser(data);
  },
};

Meteor.methods({
  ...userRegisterMethod,
});
