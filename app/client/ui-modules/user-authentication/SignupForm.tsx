import React, { useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { EyeIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import {
  updateField,
  clearForm,
  registerUser,
  selectSignupFormUIState,
} from "./state/reducers/signup-form-slice";

const inputClass =
  "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 text-sm";
const labelClass = "block mb-1 text-sm font-medium text-gray-700";

export const SignupForm = () => {
  const dispatch = useAppDispatch();
  const formState = useAppSelector(selectSignupFormUIState);

  useEffect(() => {
    dispatch(clearForm());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser());
  };

  const handleChange =
    (field: keyof typeof formState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateField({ field, value: e.target.value }));
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Account Type</h2>
        <Tabs.Root
          value={formState.accountType}
          onValueChange={(val) =>
            dispatch(updateField({ field: "accountType", value: val }))
          }
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
            id="firstName"
            type="text"
            value={formState.firstName}
            onChange={handleChange("firstName")}
            placeholder="John"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>Last Name</label>
          <input
            id="lastName"
            type="text"
            value={formState.lastName}
            onChange={handleChange("lastName")}
            placeholder="Doe"
            className={inputClass}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input
          id="email"
          type="email"
          value={formState.email}
          onChange={handleChange("email")}
          placeholder="example@email.com"
          className={inputClass}
          required
        />
      </div>

      <div className="relative">
        <label htmlFor="password" className={labelClass}>Password</label>
        <input
          id="password"
          type={formState.passwordVisible ? "text" : "password"}
          value={formState.password}
          onChange={handleChange("password")}
          placeholder="••••••••"
          className={inputClass}
          required
        />
        <button
          type="button"
          className="absolute top-9 right-3 text-gray-500"
          onClick={() =>
            dispatch(
              updateField({
                field: "passwordVisible",
                value: !formState.passwordVisible,
              })
            )
          }
        >
          <EyeIcon className="w-5 h-5" />
        </button>
        <p className="text-xs text-gray-500 mt-1">
          Password must be at least 8 characters long
        </p>
      </div>

      {formState.accountType === "agent" && (
        <div>
          <label htmlFor="agentCode" className={labelClass}>
            Agent Verification Code
          </label>
          <input
            id="agentCode"
            type="text"
            value={formState.agentCode}
            onChange={handleChange("agentCode")}
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
        disabled={formState.isLoading}
      >
        {formState.isLoading ? "Creating..." : "Create Account"}
      </button>

      {formState.message && (
        <p className="text-center text-sm text-gray-700">{formState.message}</p>
      )}

      <p className="text-xs text-center text-gray-500">
        By continuing, you agree to our{" "}
        <span className="underline cursor-pointer">Terms of Service</span> and{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>
      </p>
    </form>
  );
};
