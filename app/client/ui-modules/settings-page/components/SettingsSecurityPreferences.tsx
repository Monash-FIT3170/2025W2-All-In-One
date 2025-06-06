"use client"
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Toast } from "/app/client/ui-modules/settings-page/components/Toast";
import { Button } from "/app/client/ui-modules/theming-shadcn/Button";
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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      security_emails: true,
    },
  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    Toast({
      title: "You submitted the following values:",
      content: JSON.stringify(data, null, 2),
    })
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
                    <Button>Change Password</Button>
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
                    <Button> View History</Button>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}