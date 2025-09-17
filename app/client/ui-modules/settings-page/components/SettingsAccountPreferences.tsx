"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "/app/client/ui-modules/theming-shadcn/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "/app/client/ui-modules/settings-page/components/Form";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import { useNavigate } from "react-router";
import { signoutUser } from "../../user-authentication/state/reducers/current-user-slice";
import { NavigationPath } from "/app/client/navigation";

const FormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
});

export function SettingsAccountPreferences() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profileData = useAppSelector((state) => state.currentUser.profileData);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      security_emails: true,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Account preferences updated:", data);
  }

  async function handleLogout() {
    try {
      await dispatch(signoutUser()).unwrap();
      navigate("/"); // redirect to landing page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function handleManageAccount() {
    navigate(NavigationPath.Profile);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Account Settings</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Account Information</FormLabel>
                    <FormDescription>
                      {profileData ? `${profileData.firstName} ${profileData.lastName} - ${profileData.email}` : "Loading..."}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Button onClick={handleManageAccount}>Manage Account</Button>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="security_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Sign Out</FormLabel>
                    <FormDescription>
                      Sign out of all devices on this account
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Button variant="destructive" onClick={handleLogout}>
                      Sign Out
                    </Button>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
