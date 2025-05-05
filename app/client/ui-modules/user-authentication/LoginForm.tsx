import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import * as Tabs from "@radix-ui/react-tabs";

// Tailwind utility classes
const cardClass =
  "w-full max-w-lg rounded-xl border bg-white shadow-lg p-8";
const inputClass =
  "w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 text-sm";
const labelClass = "block mb-1 text-sm font-medium text-gray-700";
const buttonClass =
  "w-full bg-black text-yellow-400 py-2 px-4 rounded-md hover:bg-black/90 text-sm";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Meteor.loginWithPassword(username, password, (error) => {
      if (error instanceof Meteor.Error) {
        setMessage(`Login failed: ${error.reason}`);
      } else if (error) {
        setMessage("An unknown error occurred.");
      } else {
        setMessage("Login successful!");
        setUsername("");
        setPassword("");
      }
    });
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gray-50 px-4">
      <div className={cardClass}>
        <Tabs.Root defaultValue="login" className="w-full">
          <Tabs.List className="grid grid-cols-2 mb-6">
            <Tabs.Trigger
              value="login"
              className="py-2 text-center border-b-2 data-[state=active]:border-black data-[state=active]:font-bold"
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              value="register"
              className="py-2 text-center border-b-2 data-[state=active]:border-black data-[state=active]:font-bold"
            >
              Register
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="login">
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label htmlFor="username" className={labelClass}>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  required
                  className={inputClass}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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

              <button type="submit" className={buttonClass}>
                Log In
              </button>

              {message && (
                <p className="text-sm text-center mt-3 text-gray-700">{message}</p>
              )}
            </form>
          </Tabs.Content>

          <Tabs.Content value="register">
            <div className="text-center text-sm text-muted-foreground">
              Registration not implemented yet.
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};
