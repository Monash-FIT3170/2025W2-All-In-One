"use client"
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "/app/client/ui-modules/theming-shadcn/Button";
import { ChangePasswordPopup } from "/app/client/ui-modules/settings-page/components/ChangePasswordPopup";
import { LoginHistoryModal } from "/app/client/ui-modules/settings-page/components/LoginHistoryModal";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "/app/client/ui-modules/settings-page/components/Form";
 
const FormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})
 
export function SettingsSecurityPreferences() {
  const [showLoginHistory, setShowLoginHistory] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      security_emails: true,
    },
  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Security preferences updated:", data);
  }
 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Security Preferences</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Password</FormLabel>
                    <FormDescription>
                      Regularly update your password to keep your account secure.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <ChangePasswordPopup />
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
                    <FormLabel>Sign in History</FormLabel>
                    <FormDescription>
                      View your recent Sign in history
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Button type="button" onClick={() => setShowLoginHistory(true)}> View History</Button>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <LoginHistoryModal isOpen={showLoginHistory} onClose={() => setShowLoginHistory(false)} />
      </form>
    </Form>
  )
}