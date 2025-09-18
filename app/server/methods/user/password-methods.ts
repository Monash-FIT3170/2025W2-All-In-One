import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Accounts } from "meteor/accounts-base";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

type ValidatePasswordPayload = {
  currentPassword: string;
};

export const passwordMethods = {
  [MeteorMethodIdentifier.VALIDATE_PASSWORD]: async (data: ValidatePasswordPayload) => {
    console.log("VALIDATE_PASSWORD method called with:", { currentPassword: "***" });
    
    validatePasswordPayload(data);

    if (!Meteor.userId()) {
      console.log("No user ID found");
      throw new Meteor.Error("not-authorized", "User must be logged in to validate password.");
    }

    try {
      // Get the current user using the async method
      const user = await Meteor.userAsync();
      if (!user) {
        console.log("No user found");
        throw new Meteor.Error("not-authorized", "User not found.");
      }

      console.log("User found:", user._id);

      // Try a simpler approach - use Meteor's built-in password verification
      // Let's try using the Accounts package's built-in methods
      try {
        // Try to use Accounts._checkPassword if it exists
        if (typeof Accounts._checkPassword === 'function') {
          const result = Accounts._checkPassword(user, data.currentPassword);
          console.log("Accounts._checkPassword result:", result);
          
          if (result.error) {
            throw new Meteor.Error("invalid-password", "Current password is incorrect.");
          }
        } else {
          // Fallback to manual bcrypt validation
          const userServices = user.services as any;
          console.log("User services:", JSON.stringify(userServices, null, 2));
          
          if (!userServices || !userServices.password) {
            console.log("User has no password service");
            throw new Meteor.Error("invalid-password", "Current password is incorrect.");
          }

          const passwordService = userServices.password;
          console.log("Password service structure:", JSON.stringify(passwordService, null, 2));

          if (passwordService.bcrypt) {
            console.log("Bcrypt hash found:", passwordService.bcrypt.substring(0, 20) + "...");
            console.log("Input password:", data.currentPassword);
            
            const bcrypt = require('bcrypt');
            const isValid = await bcrypt.compare(data.currentPassword, passwordService.bcrypt);
            console.log("Bcrypt validation result:", isValid);
            
            if (!isValid) {
              console.log("Password validation failed - bcrypt comparison returned false");
              throw new Meteor.Error("invalid-password", "Current password is incorrect.");
            }
          } else {
            console.log("No bcrypt hash found in password service");
            console.log("Available password service keys:", Object.keys(passwordService));
            throw new Meteor.Error("invalid-password", "Current password is incorrect.");
          }
        }
      } catch (validationError) {
        console.log("Password validation error:", validationError);
        throw new Meteor.Error("invalid-password", "Current password is incorrect.");
      }

      console.log("Password validation successful");
      return { valid: true };
    } catch (err: any) {
      console.log("Error in password validation:", err);
      if (err instanceof Meteor.Error) {
        throw err;
      }
      throw new Meteor.Error("validation-failed", "Password validation failed.");
    }
  },
};

// Helper functions
function validatePasswordPayload(data: ValidatePasswordPayload) {
  check(data, {
    currentPassword: String,
  });

  if (!data.currentPassword?.trim()) {
    throw new Meteor.Error("invalid-data", "Current password is required.");
  }
}

// Register the methods with Meteor
Meteor.methods(passwordMethods);
