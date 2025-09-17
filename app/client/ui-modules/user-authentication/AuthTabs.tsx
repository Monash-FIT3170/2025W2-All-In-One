import React, { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useNavigate, useLocation } from "react-router";
import { SigninForm } from "./SigninForm";
import { SignupForm } from "./SignupForm";
import { NavigationPath } from "../../navigation";

const tabTriggerClass =
  "w-full inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 cursor-pointer text-sm font-medium transition-all text-gray-500 data-[state=active]:bg-white data-[state=active]:text-black";

// Literal type for allowed tabs
export type AuthTabType = typeof NavigationPath.Signin | typeof NavigationPath.Signup;

// Map for tab labels and paths
export const AUTH_TABS = {
  SIGNIN: { label: "Sign in", path: NavigationPath.Signin },
  SIGNUP: { label: "Sign up", path: NavigationPath.Signup },
} as const;

type AuthTabsProps = {
  initialTab: AuthTabType;
};

export const AuthTabs = ({ initialTab }: AuthTabsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState<AuthTabType>(initialTab);

  // Sync tab state with current URL path
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === NavigationPath.Signin) {
      setTab(AUTH_TABS.SIGNIN.path);
    } else if (currentPath === NavigationPath.Signup) {
      setTab(AUTH_TABS.SIGNUP.path);
    }
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    // Only change if the value matches one of our tab paths
    if (
      value === AUTH_TABS.SIGNIN.path ||
      value === AUTH_TABS.SIGNUP.path
    ) {
      const newTab: AuthTabType = value;
      setTab(newTab);
      navigate(newTab);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-xl border bg-white shadow-lg p-8">
        <Tabs.Root value={tab} onValueChange={handleTabChange} className="w-full">
          <Tabs.List className="inline-flex items-center justify-center w-full rounded-full bg-gray-100 p-1 mb-6">
            <Tabs.Trigger value={AUTH_TABS.SIGNIN.path} className={tabTriggerClass}>
              {AUTH_TABS.SIGNIN.label}
            </Tabs.Trigger>
            <Tabs.Trigger value={AUTH_TABS.SIGNUP.path} className={tabTriggerClass}>
              {AUTH_TABS.SIGNUP.label}
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value={AUTH_TABS.SIGNIN.path}>
            <SigninForm />
          </Tabs.Content>

          <Tabs.Content value={AUTH_TABS.SIGNUP.path}>
            <SignupForm />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};
