import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Accounts } from "meteor/accounts-base";

Meteor.methods({
  async "user.register"(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    accountType: "tenant" | "landlord" | "agent";
    agentCode?: string;
  }) {
    // check that the value matches the pattern
    check(data, {
      email: String,
      password: String,
      firstName: String,
      lastName: String,
      accountType: Match.OneOf("tenant", "landlord", "agent"),
      agentCode: Match.Maybe(String),
    });

    // other custom checks
    if (data.password.length < 8) {
      throw new Meteor.Error("weak-password", "Password must be at least 8 characters long.");
    }

    // Build profile upfront
    const profileData: Record<string, any> = {
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.accountType,
    };

    // Agent-specific validation and profile field
    if (data.accountType === "agent") {
      if (!data.agentCode || data.agentCode.trim() === "") {
        throw new Meteor.Error("missing-code", "Agent verification code is required.");
      }

      if (data.agentCode !== "AGENT123") {
        throw new Meteor.Error("invalid-code", "Invalid agent verification code.");
      }

      profileData.agentCode = data.agentCode;
    }

    try {
      const userId = await Accounts.createUserAsync({
        email: data.email,
        password: data.password,
        profile: profileData,
      });

      console.log("✅ User created:", userId);
      return { userId };
    } catch (e: any) {
      console.error("❌ Account creation failed:", e);

      if (e instanceof Meteor.Error) {
        if ( e?.message?.includes("Something went wrong. Please check your credentials.")) {
          throw new Meteor.Error(403, "An account with this email already exists.");
        }
      }
      throw new Meteor.Error("registration-failed", "Something went wrong during registration.");
    }
  },
});
