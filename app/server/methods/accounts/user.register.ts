import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Accounts } from "meteor/accounts-base";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  accountType: "tenant" | "landlord" | "agent";
  agentCode?: string;
};

function validateRegisterPayload(data: RegisterPayload) {
  check(data, {
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    accountType: Match.OneOf("tenant", "landlord", "agent"),
    agentCode: Match.Maybe(String),
  });

  if (data.password.length < 8) {
    throw new Meteor.Error(
      "weak-password",
      "Password must be at least 8 characters long."
    );
  }

  if (data.accountType === "agent") {
    if (!data.agentCode?.trim()) {
      throw new Meteor.Error(
        "missing-code",
        "Agent verification code is required."
      );
    }
    if (data.agentCode !== "AGENT123") {
      throw new Meteor.Error(
        "invalid-code",
        "Invalid agent verification code."
      );
    }
  }
}

function buildUserProfile(data: RegisterPayload): Record<string, any> {
  const profileData: Record<string, any> = {
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.accountType,
    createdAt: new Date(),
  };

  if (data.accountType === "agent") {
    profileData.agentCode = data.agentCode;
  }

  return profileData;
}

async function registerUser(
  data: RegisterPayload
): Promise<{ userId: string }> {
  const profile = buildUserProfile(data);

  try {
    const userId = await Accounts.createUserAsync({
      email: data.email,
      password: data.password,
      profile,
    });

    return { userId };
  } catch (e: any) {
    if (
      e instanceof Meteor.Error &&
      e.message?.includes(
        "Something went wrong. Please check your credentials."
      )
    ) {
      throw new Meteor.Error(403, "An account with this email already exists.");
    }

    throw new Meteor.Error(
      "registration-failed",
      "Something went wrong during registration."
    );
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
