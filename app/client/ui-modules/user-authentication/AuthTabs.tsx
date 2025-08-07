import React, { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useNavigate, useLocation } from "react-router";
import { SigninForm } from "./SigninForm";
import { SignupForm } from "./SignupForm";
import { NavigationPath } from "../../navigation";

const tabTriggerClass =
  "w-full inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all text-gray-500 data-[state=active]:bg-white data-[state=active]:text-black";

type AuthTabsProps = {
  initialTab: "signin" | "signup";
};

export const AuthTabs = ({ initialTab }: AuthTabsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState<"signin" | "signup">(initialTab);

  // Sync tab state with current URL path
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === NavigationPath.Signin) {
      setTab("signin");
    } else if (currentPath === NavigationPath.Signup) {
      setTab("signup");
    }
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    const newTab = value as "signin" | "signup";
    setTab(newTab);
    navigate(newTab === "signup" ? NavigationPath.Signup : NavigationPath.Signin);
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-xl border bg-white shadow-lg p-8">
        <Tabs.Root value={tab} onValueChange={handleTabChange} className="w-full">
          <Tabs.List className="inline-flex items-center justify-center w-full rounded-full bg-gray-100 p-1 mb-6">
            <Tabs.Trigger value="signin" className={tabTriggerClass}>
              Sign in 
            </Tabs.Trigger>
            <Tabs.Trigger value="signup" className={tabTriggerClass}>
              Sign up
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="signin">
            <SigninForm />
          </Tabs.Content>

          <Tabs.Content value="signup">
            <SignupForm />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};
