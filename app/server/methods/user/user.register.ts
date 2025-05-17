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


export const userRegisterMethod = {
  [MeteorMethodIdentifier.USER_REGISTER]: async (data: RegisterPayload) => {
    validatePayload(data);

    // creating meteor users based on meteor account library
    const userId = await createAuthUser(data.email, data.password);
    // create a user account record
    await createUserAccount(userId, data.accountType);
    // creating the role specifci record whether a tenant/agent/landlord account
    await createRoleSpecificRecord(userId, data);

    return { userId };
  },
};


// -- Helper Methods --

function validatePayload(data: RegisterPayload) {
  check(data, {
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    accountType: Match.OneOf(...Object.values(Role)),
    agentCode: Match.Maybe(String),
  });

  if (data.password.length < 8) {
    throw new Meteor.Error("weak-password", "Password must be at least 8 characters long.");
  }

  if (data.accountType === Role.AGENT) {
    if (!data.agentCode?.trim()) {
      throw new Meteor.Error("missing-code", "Agent verification code is required.");
    }
    if (data.agentCode !== "AGENT123") {
      throw new Meteor.Error("invalid-code", "Invalid agent verification code.");
    }
  }
}

async function createAuthUser(email: string, password: string): Promise<string> {
  try {
    return await Accounts.createUserAsync({ email, password });
  } catch (e: any) {
    if (
      e instanceof Meteor.Error &&
      e.message?.includes("check your credentials")
    ) {
      throw new Meteor.Error(403, "An account with this email already exists.");
    }

    throw new Meteor.Error("registration-failed", "Something went wrong during registration.");
  }
}

async function createUserAccount(userId: string, role: Role): Promise<void> {
  await Meteor.callAsync(MeteorMethodIdentifier.USER_ACCOUNT_INSERT, {
    _id: userId,
    role,
  });
}

async function createRoleSpecificRecord(userId: string, data: RegisterPayload): Promise<void> {
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
}

Meteor.methods({
  ...userRegisterMethod,
});