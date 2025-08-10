import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import { useLocation, useNavigate } from "react-router";
import {
  selectSigninFormUIState,
  setEmail,
  setPassword,
  signinUser,
} from "./state/reducers/signin-form-slice";
import { useRoleBasedRedirect } from "./hooks/useRoleBasedRedirect";

const inputClass =
  "w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 text-sm";
const labelClass = "block mb-1 text-sm font-medium text-gray-700";

export const SigninForm = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const signinState = useAppSelector(selectSigninFormUIState);
  const { redirectToDashboard } = useRoleBasedRedirect();
  // this is to be used to redirect to dashboard once a direct sign in is requested
  const authUser = useAppSelector((state) => state.currentUser.authUser);

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(signinUser());

    // check if sing in was redirected from an original request
    if (signinUser.fulfilled.match(result)) {
      if (from) {
        // navigate to the original request
        navigate(from, { replace: true });
      }
      // else: do nothing, let useEffect handle dashboard redirect
    }
  };

  // Redirect to dashboard after login if no "from" and user is authenticated
  useEffect(() => {
    if (authUser && !from) {
      redirectToDashboard();
    }
  }, [authUser, from, redirectToDashboard]);

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