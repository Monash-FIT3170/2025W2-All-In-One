import React from "react";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import {
  selectLoginFormUIState,
  setEmail,
  setPassword,
  loginUser,
} from "./state/reducers/login-form-slice";
import { useRedirectToDashboard } from "./redirectToDashboardHook";

const inputClass =
  "w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 text-sm";
const labelClass = "block mb-1 text-sm font-medium text-gray-700";

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const loginState = useAppSelector(selectLoginFormUIState);
  const redirectToDashboard = useRedirectToDashboard();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(loginUser());

    if (loginUser.fulfilled.match(result)) {
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
          value={loginState.email}
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
          value={loginState.password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-black/90"
        disabled={loginState.isLoading}
      >
        {loginState.isLoading ? "Logging in..." : "Login"}
      </button>
      {loginState.message && (
        <p className="text-sm text-center mt-3 text-gray-700">
          {loginState.message}
        </p>
      )}
    </form>
  );
};