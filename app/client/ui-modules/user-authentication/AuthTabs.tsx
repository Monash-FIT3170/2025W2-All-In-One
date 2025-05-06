import React, { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useLocation, useNavigate } from "react-router";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

// Styles
const cardClass = "w-full max-w-lg rounded-xl border bg-white shadow-lg p-8";
const tabsListClass = "inline-flex items-center justify-center w-full rounded-full bg-gray-100 p-1 mb-6";
const tabTriggerClass = "w-full inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all text-gray-500 data-[state=active]:bg-white data-[state=active]:text-black";


export const AuthTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = location.pathname === "/signup" ? "signup" : "login";

  const [tab, setTab] = useState(initialTab);

  // Sync tab change with route
  useEffect(() => {
    setTab(initialTab);
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setTab(value);
    navigate(value === "signup" ? "/signup" : "/login");
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gray-50 px-4">
      <div className={cardClass}>
        <Tabs.Root
          value={tab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <Tabs.List className={tabsListClass}>
            <Tabs.Trigger value="login" className={tabTriggerClass}>
              Login
            </Tabs.Trigger>
            <Tabs.Trigger value="signup" className={tabTriggerClass}>
              Sign up
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="login">
            <LoginForm />
          </Tabs.Content>

          <Tabs.Content value="signup">
            <SignupForm />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};
