import React from "react";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import {
  selectSigninFormUIState,
  setEmail,
  setPassword,
  signinUser,
} from "./state/reducers/signin-form-slice";
import { useRedirectToDashboard } from "../hooks/redirectToDashboardHook";

const inputClass =
  "w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 text-sm";
const labelClass = "block mb-1 text-sm font-medium text-gray-700";

export const SigninForm = () => {
  const dispatch = useAppDispatch();
  const signinState = useAppSelector(selectSigninFormUIState);
  const redirectToDashboard = useRedirectToDashboard();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(signinUser());

    if (signinUser.fulfilled.match(result)) {
      redirectToDashboard(result.payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="example@email.com"
          required
          className={inputClass}
          value={signinState.email}
          onChange={(e) => dispatch(setEmail(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className={inputClass}
          value={signinState.password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-black/90"
        disabled={signinState.isLoading}
      >
        {signinState.isLoading ? "signing in..." : "sign in"}
      </button>
      {signinState.message && (
        <p className="text-sm text-center mt-3 text-gray-700">
          {signinState.message}
        </p>
      )}
    </form>
  );
};