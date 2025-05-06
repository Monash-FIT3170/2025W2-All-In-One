import React, { useState } from "react";
import { Meteor } from "meteor/meteor";

const inputClass =
  "w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 text-sm";
const labelClass = "block mb-1 text-sm font-medium text-gray-700";
const buttonClass =
  "w-full bg-black text-yellow-400 py-2 px-4 rounded-md hover:bg-black/90 text-sm";

export const LoginForm = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Meteor.loginWithPassword(email, password, (error) => {
      if (error instanceof Meteor.Error) {
        setMessage(`Login failed: ${error.reason}`);
      } else if (error) {
        setMessage("An unknown error occurred.");
      } else {
        setMessage("Login successful!");
        // TODO: REDIRECT TO THE DASHBOARD BASED ON THE ROLE 
        setemail("");
        setPassword("");
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="email" className={labelClass}>
          email
        </label>
        <input
          id="email"
          name="email"
          type="text"
          placeholder="example@email.com"
          required
          className={inputClass}
          value={email}
          onChange={(e) => setemail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-black/90"
      >
        Login
      </button>

      {message && (
        <p className="text-sm text-center mt-3 text-gray-700">{message}</p>
      )}
    </form>
  );
};
