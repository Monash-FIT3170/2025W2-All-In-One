import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { EyeIcon } from "lucide-react";
import { Meteor } from "meteor/meteor";

const inputClass =
  "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 text-sm";
const labelClass = "block mb-1 text-sm font-medium text-gray-700";

export const SignupForm = () => {
  const [formData, setFormData] = useState({
    accountType: "tenant",
    passwordVisible: false,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agentCode: "",
  });

  const [message, setMessage] = useState("");

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      accountType: formData.accountType,
      agentCode:
        formData.accountType === "agent" ? formData.agentCode : undefined,
    };

    Meteor.call(
      "user.register",
      payload,
      (err: { reason: string } | undefined) => {
        if (err) {
          setMessage(err.reason || "Registration failed.");
        } else {
          setMessage("Account created successfully!");
          setFormData({
            accountType: "tenant",
            passwordVisible: false,
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            agentCode: "",
          });
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Account Type</h2>
        <Tabs.Root
          value={formData.accountType}
          onValueChange={(val) => updateField("accountType", val)}
          className="w-full"
        >
          <Tabs.List className="grid grid-cols-3 gap-2 mt-2">
            {[
              { type: "tenant", label: "Tenant", icon: "👤" },
              { type: "landlord", label: "Landlord", icon: "🏢" },
              { type: "agent", label: "Agent", icon: "💼" },
            ].map(({ type, label, icon }) => (
              <Tabs.Trigger
                key={type}
                value={type}
                className={`
                  flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-all
                  border border-gray-300 text-gray-700 bg-white
                  data-[state=active]:border-black data-[state=active]:shadow-sm
                `}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField("firstName", e.target.value)
            }
            placeholder="John"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField("lastName", e.target.value)
            }
            placeholder="Doe"
            className={inputClass}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateField("email", e.target.value)
          }
          placeholder="example@email.com"
          className={inputClass}
          required
        />
      </div>

      <div className="relative">
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          type={formData.passwordVisible ? "text" : "password"}
          id="password"
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateField("password", e.target.value)
          }
          placeholder="••••••••"
          className={inputClass}
          required
        />
        <button
          type="button"
          className="absolute top-9 right-3 text-gray-500"
          onClick={() =>
            updateField("passwordVisible", !formData.passwordVisible)
          }
        >
          <EyeIcon className="w-5 h-5" />
        </button>
        <p className="text-xs text-gray-500 mt-1">
          Password must be at least 8 characters long
        </p>
      </div>

      {formData.accountType === "agent" && (
        <div>
          <label htmlFor="agentCode" className={labelClass}>
            Agent Verification Code
          </label>
          <input
            type="text"
            id="agentCode"
            value={formData.agentCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField("agentCode", e.target.value)
            }
            className={inputClass}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This code is provided by your agency administrator
          </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-black/90"
      >
        Create Account
      </button>

      {message && (
        <p className="text-center text-sm text-gray-700">{message}</p>
      )}

      <p className="text-xs text-center text-gray-500">
        By continuing, you agree to our{" "}
        <span className="underline cursor-pointer">Terms of Service</span> and{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>
      </p>
    </form>
  );
};
