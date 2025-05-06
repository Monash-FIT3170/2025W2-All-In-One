import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { EyeIcon } from "lucide-react";
import { Meteor } from "meteor/meteor";

const inputClass =
  "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 text-sm";
const labelClass = "block mb-1 text-sm font-medium text-gray-700";

export const SignupForm = () => {
  const [accountType, setAccountType] = useState("tenant");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agentCode, setAgentCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      email,
      password,
      firstName,
      lastName,
      accountType,
      agentCode: accountType === "agent" ? agentCode : undefined,
    };

    Meteor.call("user.register", formData, (err: { reason: string } | undefined) => {
      if (err) {
        setMessage(err.reason || "Registration failed.");
      } else {
        setMessage("Account created successfully!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setAgentCode("");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Account Type</h2>
        <Tabs.Root
          value={accountType}
          onValueChange={setAccountType}
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
          <label htmlFor="firstName" className={labelClass}>First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className={inputClass}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className={inputClass}
          required
        />
      </div>

      <div className="relative">
        <label htmlFor="password" className={labelClass}>Password</label>
        <input
          type={passwordVisible ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
          required
        />
        <button
          type="button"
          className="absolute top-9 right-3 text-gray-500"
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          <EyeIcon className="w-5 h-5" />
        </button>
        <p className="text-xs text-gray-500 mt-1">
          Password must be at least 8 characters long
        </p>
      </div>

      {accountType === "agent" && (
        <div>
          <label htmlFor="agentCode" className={labelClass}>Agent Verification Code</label>
          <input
            type="text"
            id="agentCode"
            value={agentCode}
            onChange={(e) => setAgentCode(e.target.value)}
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
